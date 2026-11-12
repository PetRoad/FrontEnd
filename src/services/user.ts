import { useQuery } from "@tanstack/react-query";
import { api, upload } from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import type { Dog, DogSize } from "@/types/dog";

export const SIZE = { 소형: "SMALL", 중형: "MEDIUM", 대형: "LARGE" } as const satisfies Record<DogSize, string>;

export type ApiDog = {
  name: string;
  breed: string;
  size: (typeof SIZE)[DogSize];
  birthDate: string; // YYYY-MM-DD
  profileImage?: string | null;
};

export const toDog = (d: ApiDog): Dog => ({
  name: d.name,
  breed: d.breed,
  size: (Object.keys(SIZE) as DogSize[]).find((k) => SIZE[k] === d.size) ?? "소형",
  birth: d.birthDate,
  photo: d.profileImage ?? undefined,
});

export async function saveRegion(region: string) {
  await api("/api/users/me/region", { method: "PUT", body: { region } });
  useUserStore.setState({ region });
}

// 앨범에서 막 고른 사진(기기 안 uri)이면 먼저 올리고 받은 주소로 저장한다
export async function saveDog(dog: Dog) {
  const profileImage = dog.photo && !/^https?:\/\//.test(dog.photo) ? await upload(dog.photo, "DOG_PROFILE") : dog.photo;
  const saved = await api<ApiDog>("/api/me/dog", {
    method: "PUT",
    body: { name: dog.name, breed: dog.breed, size: SIZE[dog.size], birthDate: dog.birth, profileImage },
  });
  useUserStore.setState({ dog: toDog(saved) });
}

export type Stats = {
  walkCount: number; // 산책일지 수 = 함께 걸은 횟수
  totalDistanceMeters: number;
  photoCount: number;
  courseCount: number; // 내가 만든(공유한) 코스 수
  likedCourseCount: number;
};

// 산책 저장·삭제 뒤 ["me"]로 시작하는 키를 다시 불러온다
export const useStats = () => useQuery({ queryKey: ["me", "stats"], queryFn: () => api<Stats>("/api/me/stats") });
