import type { LatLng } from "react-native-maps";

export type Walk = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  distanceKm: number;
  durationSec: number;
  photos: string[];
  cover?: string; // 대표 사진. 없으면 첫 사진
  courseId?: string; // 따라 걷기한 코스
  completion?: number; // 완주율 %
  route?: LatLng[]; // 걸은 길 (GPS 점)
};
