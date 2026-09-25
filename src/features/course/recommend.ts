import type { Course } from "@/types/course";

const BASE_KM = 1.5;
const MAX_KM = 3;
const MIN_COUNT = 3;

// 기본 1.5km, 코스가 3개 미만이면 3km까지 확장. 좋아요 많은 순 → 가까운 순
export function recommend(courses: Course[]) {
  const within = (r: number) => courses.filter((c) => c.fromMeKm <= r);
  const radius = within(BASE_KM).length >= MIN_COUNT ? BASE_KM : MAX_KM;
  const list = within(radius).sort((a, b) => b.likes - a.likes || a.fromMeKm - b.fromMeKm);
  return { radius, list };
}
