import { useQuery } from "@tanstack/react-query";
import type { LatLng } from "react-native-maps";
import { queryClient } from "@/providers/QueryProvider";
import { api, upload } from "@/services/api";
import { SIZE } from "@/services/user";
import { useUserStore } from "@/stores/userStore";
import type { Course, Difficulty } from "@/types/course";
import type { Walk } from "@/types/walk";

const DIFFICULTY = { 쉬움: "EASY", 보통: "NORMAL", 어려움: "HARD" } as const satisfies Record<Difficulty, string>;
type ApiDifficulty = (typeof DIFFICULTY)[Difficulty];
const toDifficulty = (d: ApiDifficulty) => (Object.keys(DIFFICULTY) as Difficulty[]).find((k) => DIFFICULTY[k] === d) ?? "보통";

type ApiPoint = { lat: number; lng: number };

// 추천 목록, 등록, 좋아요 응답. id가 숫자이고 거리는 km
type ApiSummary = {
  id: number;
  name: string;
  coverImageUrl: string | null;
  distanceKm: number;
  difficulty: ApiDifficulty;
  likeCount: number;
  liked: boolean;
  tags: string[] | null;
  creatorDogBreed: string | null;
  creatorDogAge: number | null;
};

// 상세, 내가 만든 코스, 좋아요한 코스 응답. id가 문자열이고 거리는 m
type ApiDetail = {
  id: string;
  name: string;
  cover: string | null;
  distanceMeters: number;
  difficulty: ApiDifficulty;
  likes: number;
  liked: boolean;
  mine: boolean;
  tags: string[] | null;
  points: ApiPoint[] | null;
  creatorDogBreed: string | null;
  creatorDogAge: number | null;
};

const fromSummary = (c: ApiSummary): Course => ({
  id: String(c.id),
  name: c.name,
  cover: c.coverImageUrl ?? undefined,
  likes: c.likeCount,
  liked: c.liked,
  distanceKm: c.distanceKm,
  difficulty: toDifficulty(c.difficulty),
  tags: c.tags ?? [],
  breed: c.creatorDogBreed ?? undefined,
  dogAge: c.creatorDogAge ?? undefined,
});

const fromDetail = (c: ApiDetail): Course => ({
  id: c.id,
  name: c.name,
  cover: c.cover ?? undefined,
  likes: c.likes,
  liked: c.liked,
  mine: c.mine,
  distanceKm: c.distanceMeters / 1000,
  difficulty: toDifficulty(c.difficulty),
  tags: c.tags ?? [],
  breed: c.creatorDogBreed ?? undefined,
  dogAge: c.creatorDogAge ?? undefined,
  route: c.points?.map((p) => ({ latitude: p.lat, longitude: p.lng })),
});

// 서버가 반경을 정한다: 1.5km 안에 3개 이상이면 1.5km, 아니면 3km. 좋아요 많은 순, 가까운 순
export const useRecommended = (at: LatLng | null | undefined) =>
  useQuery({
    queryKey: ["courses", at?.latitude, at?.longitude],
    queryFn: () =>
      api<{ radiusKm: number; courses: ApiSummary[] }>(`/api/courses?lat=${at!.latitude}&lng=${at!.longitude}`).then((r) => ({
        radiusKm: r.radiusKm,
        courses: r.courses.map(fromSummary),
      })),
    enabled: !!at,
  });

export const useCourse = (id: string | undefined) =>
  useQuery({ queryKey: ["course", id], queryFn: () => api<ApiDetail>(`/api/courses/${id}`).then(fromDetail), enabled: !!id });

export const useMyCourses = () =>
  useQuery({ queryKey: ["me", "courses"], queryFn: () => api<ApiDetail[]>("/api/me/courses").then((cs) => cs.map(fromDetail)) });

export const useLikedCourses = () =>
  useQuery({ queryKey: ["me", "likes"], queryFn: () => api<ApiDetail[]>("/api/me/likes").then((cs) => cs.map(fromDetail)) });

// 추천 목록과 마이(통계, 내 코스, 좋아요한 코스)를 새로 불러온다
const refresh = () =>
  Promise.all([queryClient.invalidateQueries({ queryKey: ["courses"] }), queryClient.invalidateQueries({ queryKey: ["me"] })]);

// 하트는 누르자마자 바꾸고, 실패하면 되돌린다
export async function toggleLike(c: Course) {
  const set = (liked: boolean, likes: number) =>
    queryClient.setQueryData<Course>(["course", c.id], (old) => old && { ...old, liked, likes });
  set(!c.liked, c.likes + (c.liked ? -1 : 1));
  try {
    const r = await api<ApiSummary>(`/api/courses/${c.id}/like`, { method: c.liked ? "DELETE" : "POST" });
    set(r.liked, r.likeCount);
  } catch (e) {
    set(c.liked, c.likes);
    throw e;
  }
  await refresh();
}

// 코스와 좋아요만 지운다. 이 코스로 걸은 산책일지는 남는다
export async function deleteCourse(id: string) {
  await api(`/api/courses/${id}`, { method: "DELETE" });
  queryClient.removeQueries({ queryKey: ["course", id] });
  await refresh();
}

type NewCourse = { name: string; cover?: string; tags: string[]; difficulty: Difficulty };

// 오늘 걸은 길을 코스로 올린다. 견종과 나이는 서버가 내 반려견 프로필에서 채운다
export async function createCourse(walk: Walk, c: NewCourse) {
  const route = walk.route ?? [];
  const dog = useUserStore.getState().dog;
  const coverImageUrl = c.cover ? await upload(c.cover, "COURSE_COVER") : undefined;
  await api("/api/courses", {
    method: "POST",
    body: {
      name: c.name,
      coverImageUrl,
      distance: walk.distanceKm,
      difficulty: DIFFICULTY[c.difficulty],
      dogSize: dog && SIZE[dog.size],
      startLat: route[0].latitude,
      startLng: route[0].longitude,
      tags: c.tags,
      points: route.map((p) => ({ lat: p.latitude, lng: p.longitude })),
    },
  });
  await refresh();
}
