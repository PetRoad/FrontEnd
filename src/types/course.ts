import type { LatLng } from "react-native-maps";

export type Difficulty = "쉬움" | "보통" | "어려움";

export type Course = {
  id: string;
  name: string;
  cover?: string;
  likes: number;
  distanceKm: number;
  difficulty: Difficulty;
  tags: string[];
  breed: string;
  dogAge: number;
  fromMeKm: number; // 현재 위치 ~ 코스 시작점
  mine?: boolean;
  route?: LatLng[]; // 코스 경로. 등록한 사람이 걸은 길
};
