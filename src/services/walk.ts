import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/providers/QueryProvider";
import { api, upload } from "@/services/api";
import type { Walk } from "@/types/walk";

type ApiWalk = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD. 서버가 저장한 날
  distanceMeters: number;
  durationSec: number | null;
  photos: string[] | null;
  cover: string | null;
  courseId: string | null;
  completion: number | null;
  route: { lat: number; lng: number }[] | null;
};

const toWalk = (w: ApiWalk): Walk => ({
  id: w.id,
  title: w.title,
  date: w.date,
  distanceKm: w.distanceMeters / 1000,
  durationSec: w.durationSec ?? 0,
  photos: w.photos ?? [],
  cover: w.cover ?? undefined,
  courseId: w.courseId ?? undefined,
  completion: w.completion ?? undefined,
  route: w.route?.map((p) => ({ latitude: p.lat, longitude: p.lng })),
});

// 산책일지 목록, 상세, 앨범이 같은 목록을 나눠 쓴다
export const useWalks = () =>
  useQuery({ queryKey: ["me", "walks"], queryFn: () => api<ApiWalk[]>("/api/me/walks").then((ws) => ws.map(toWalk)) });

// 마이 통계와 산책일지 목록을 함께 새로 불러온다
const refresh = () => queryClient.invalidateQueries({ queryKey: ["me"] });

// 사진은 기기 안 uri라 먼저 올리고 받은 주소로 저장한다. 대표 사진도 올린 주소로 바꾼다
export async function saveWalk(w: Walk) {
  const photos = await Promise.all(w.photos.map((p) => upload(p, "WALK_PHOTO")));
  const cover = w.cover ? photos[w.photos.indexOf(w.cover)] : undefined;
  await api("/api/me/walks", {
    method: "POST",
    body: {
      title: w.title,
      distanceMeters: w.distanceKm * 1000,
      durationSec: w.durationSec,
      photos,
      cover,
      route: w.route?.map((p) => ({ lat: p.latitude, lng: p.longitude })),
      courseId: w.courseId,
      completion: w.completion,
    },
  });
  await refresh();
}

export async function deleteWalk(id: string) {
  await api(`/api/me/walks/${id}`, { method: "DELETE" });
  await refresh();
}
