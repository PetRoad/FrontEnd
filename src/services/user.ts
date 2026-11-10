import { File } from "expo-file-system";
import { api } from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import type { Dog, DogSize } from "@/types/dog";

const SIZE = { 소형: "SMALL", 중형: "MEDIUM", 대형: "LARGE" } as const satisfies Record<DogSize, string>;

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
  const profileImage = dog.photo && !/^https?:\/\//.test(dog.photo) ? await upload(dog.photo) : dog.photo;
  const saved = await api<ApiDog>("/api/me/dog", {
    method: "PUT",
    body: { name: dog.name, breed: dog.breed, size: SIZE[dog.size], birthDate: dog.birth, profileImage },
  });
  useUserStore.setState({ dog: toDog(saved) });
}

// SDK 58의 fetch(expo/fetch)는 RN식 { uri, name, type }를 받지 않는다. Blob을 구현한 expo-file-system File로 보낸다
// ponytail: 웹은 앨범 사진이 blob uri라 안 올라간다. 웹을 지원할 때 picker의 asset.file을 넘기도록
async function upload(uri: string) {
  const form = new FormData();
  form.append("file", new File(uri));
  const { url } = await api<{ url: string }>("/api/uploads?purpose=DOG_PROFILE", { method: "POST", body: form });
  return url;
}
