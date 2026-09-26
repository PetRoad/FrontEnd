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
};
