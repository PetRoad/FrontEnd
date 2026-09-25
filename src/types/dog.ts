export type DogSize = "소형" | "중형" | "대형";

export type Dog = {
  name: string;
  breed: string;
  size: DogSize;
  birth: string; // YYYY-MM-DD
};
