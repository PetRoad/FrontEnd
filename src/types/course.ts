import type { LatLng } from "react-native-maps";

export type Difficulty = "쉬움" | "보통" | "어려움";

export type Course = {
  id: string;
  name: string;
  cover?: string;
  likes: number;
  liked: boolean;
  distanceKm: number;
  difficulty: Difficulty;
  tags: string[];
  breed?: string; // 코스를 만든 사람의 반려견
  dogAge?: number; // 생년월일이 없으면 비어 있다
  mine?: boolean; // 상세에서만 온다
  route?: LatLng[]; // 코스 경로. 상세에서만 온다
};
