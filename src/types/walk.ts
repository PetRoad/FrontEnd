export type Walk = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  distanceKm: number;
  durationSec: number;
  photos: string[];
  courseId?: string; // 따라 걷기한 코스
  completion?: number; // 완주율 %
};
