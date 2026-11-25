// 저장·공유가 서버로 무엇을 보내는지 확인한다. 실행: node --experimental-transform-types --no-warnings --test test/save.test.mjs
// package.json scripts에 넣으면 EAS fingerprint가 바뀌어 이미 설치된 앱에 OTA 업데이트가 가지 않는다. 다음 빌드 때 넣는다
// 앱 코드는 그대로 쓰고, 기기 기능(파일, 키체인)과 네트워크만 대신한다
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";

const STUBS = {
  "expo-file-system": "export class File extends Blob { constructor(uri) { super([uri]); } }",
  "expo-secure-store": "export const setItemAsync = async () => {}, deleteItemAsync = async () => {};",
  "@tanstack/react-query": "export const useQuery = () => {};",
  "@/providers/QueryProvider": "export const queryClient = { invalidateQueries: async () => {} };",
};
registerHooks({
  resolve(spec, ctx, next) {
    if (spec in STUBS) return { url: `data:text/javascript,${encodeURIComponent(STUBS[spec])}`, shortCircuit: true };
    if (spec.startsWith("@/")) return next(new URL(`../src/${spec.slice(2)}.ts`, import.meta.url).href, ctx);
    return next(spec, ctx);
  },
});

const { saveWalk } = await import("@/services/walk");
const { createCourse } = await import("@/services/course");
const { thin } = await import("@/utils/route");

let uploads; // 올라간 파일들 "목적 uri"
let saved; // POST 본문
let failOn; // 이 uri의 업로드는 실패
let busy, peak; // 동시에 올리는 수
beforeEach(() => {
  uploads = [];
  saved = undefined;
  failOn = undefined;
  busy = peak = 0;
});
globalThis.fetch = async (url, { body }) => {
  if (!(body instanceof FormData)) {
    saved = JSON.parse(body);
    return new Response("{}");
  }
  const uri = await body.get("file").text();
  peak = Math.max(peak, ++busy);
  await new Promise((r) => setTimeout(r, 5));
  busy--;
  if (uri === failOn) return new Response("{}", { status: 503 });
  const purpose = new URL(url, "http://x").searchParams.get("purpose");
  uploads.push(`${purpose} ${uri}`);
  return Response.json({ url: `https://cdn/${purpose}/${uri}` });
};

// 남쪽에서 북쪽으로 곧게, stepM 간격의 점 n개
const north = (n, stepM = 5, from = 37) =>
  Array.from({ length: n }, (_, i) => ({ latitude: from + (i * stepM) / 111195, longitude: 127 }));
const walk = (patch) => ({ id: "w", title: "산책", date: "2026-11-26", distanceKm: 1, durationSec: 60, photos: [], route: north(3), ...patch });
const course = { name: "코스", tags: [], difficulty: "쉬움" };

test("저장에 실패했다가 다시 누르면 이미 올린 사진은 다시 올리지 않는다", async () => {
  const w = walk({ photos: ["a1", "a2", "a3"], cover: "a2" });
  failOn = "a2";
  await assert.rejects(saveWalk(w));
  failOn = undefined;
  await saveWalk(w);
  assert.deepEqual(uploads.toSorted(), ["WALK_PHOTO a1", "WALK_PHOTO a2", "WALK_PHOTO a3"]);
  assert.deepEqual(saved.photos, ["a1", "a2", "a3"].map((p) => `https://cdn/WALK_PHOTO/${p}`));
  assert.equal(saved.cover, "https://cdn/WALK_PHOTO/a2");
});

test("같은 사진이라도 코스 커버와 산책 사진은 따로 올린다", async () => {
  await createCourse(walk(), { ...course, cover: "b1" });
  await saveWalk(walk({ photos: ["b1"] }));
  assert.deepEqual(uploads, ["COURSE_COVER b1", "WALK_PHOTO b1"]);
});

test("사진은 한 번에 4장까지만 동시에 올리고 순서를 지킨다", async () => {
  const photos = Array.from({ length: 10 }, (_, i) => `c${i}`);
  await saveWalk(walk({ photos }));
  assert.equal(peak, 4);
  assert.deepEqual(saved.photos, photos.map((p) => `https://cdn/WALK_PHOTO/${p}`));
});

test("산책이 상한을 넘어도 기록을 잃지 않게 상한에 맞춰 보낸다", async () => {
  await saveWalk(walk({ route: north(30000), durationSec: 60 * 3600, distanceKm: 500, title: "가".repeat(150) }));
  assert.equal(saved.route.length, 20000);
  assert.equal(saved.durationSec, 48 * 3600);
  assert.equal(saved.distanceMeters, 200_000);
  assert.equal(saved.title.length, 100);
});

test("상한 안의 산책은 그대로 보낸다", async () => {
  await saveWalk(walk({ route: north(3), durationSec: 60, distanceKm: 1 }));
  assert.equal(saved.route.length, 3);
  assert.equal(saved.durationSec, 60);
  assert.equal(saved.distanceMeters, 1000);
  assert.equal(saved.title, "산책");
});

test("긴 코스는 5000점으로 줄이고 시작점과 끝점, 거리는 그대로 보낸다", async () => {
  const route = north(8000);
  await createCourse(walk({ route, distanceKm: 40 }), course);
  assert.equal(saved.points.length, 5000);
  assert.deepEqual(saved.points[0], { lat: route[0].latitude, lng: 127 });
  assert.deepEqual(saved.points.at(-1), { lat: route.at(-1).latitude, lng: 127 });
  assert.equal(saved.startLat, route[0].latitude);
  assert.equal(saved.distance, 40);
});

test("thin: 순서를 지키며 첫 점과 끝 점을 남긴다", () => {
  assert.deepEqual(thin([0, 1, 2, 3, 4, 5, 6, 7, 8], 3), [0, 4, 8]);
  assert.deepEqual(thin([0, 1], 3), [0, 1]);
});
