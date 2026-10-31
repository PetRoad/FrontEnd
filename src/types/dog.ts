export type DogSize = "소형" | "중형" | "대형";

export type Dog = {
  name: string;
  breed: string;
  size: DogSize;
  birth: string; // YYYY-MM-DD
  photo?: string; // 앨범에서 고른 사진 uri
};
