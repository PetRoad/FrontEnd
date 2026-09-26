import { create } from "zustand";
import { useCourseStore } from "@/stores/courseStore";
import type { Walk } from "@/types/walk";
import { todayIso } from "@/utils/format";

type WalkState = {
  current: Walk | null; // 진행 중이거나 결과 화면에서 대기 중인 산책
  walks: Walk[]; // 산책일지
  start: (title: string, courseId?: string) => void;
  tick: () => void;
  addPhoto: () => void;
  finish: () => void;
  save: () => void;
  discard: () => void;
};

const seed: Walk[] = [
  { id: "w1", title: "성북천 산책", date: "2026-09-25", distanceKm: 3.2, durationSec: 2880, photos: ["사진 1", "사진 2", "사진 3"] },
  { id: "w2", title: "정릉천 산책", date: "2026-09-18", distanceKm: 2.1, durationSec: 1920, photos: ["사진 1"] },
  { id: "w3", title: "성북구 산책", date: "2026-08-30", distanceKm: 1.5, durationSec: 1500, photos: ["사진 1", "사진 2"] },
];

const update = (s: WalkState, patch: (w: Walk) => Partial<Walk>) =>
  s.current ? { current: { ...s.current, ...patch(s.current) } } : {};

export const useWalkStore = create<WalkState>()((set) => ({
  current: null,
  walks: seed,
  start: (title, courseId) =>
    set({ current: { id: `w${Date.now()}`, title, date: todayIso(), distanceKm: 0, durationSec: 0, photos: [], courseId } }),
  // ponytail: 가짜 GPS(초당 1.3m). expo-location watchPositionAsync로 교체
  tick: () => set((s) => update(s, (w) => ({ durationSec: w.durationSec + 1, distanceKm: w.distanceKm + 0.0013 }))),
  // ponytail: 사진 자리만 추가. expo-camera 촬영으로 교체
  addPhoto: () => set((s) => update(s, (w) => ({ photos: [...w.photos, `사진 ${w.photos.length + 1}`] }))),
  // ponytail: 완주율 임시값 = 걸은 거리 ÷ 코스 거리. 기획 §17대로 경로 매칭 알고리즘이 정해지면 교체
  finish: () =>
    set((s) =>
      update(s, (w) => {
        const course = useCourseStore.getState().courses.find((c) => c.id === w.courseId);
        return course ? { completion: Math.min(100, Math.round((w.distanceKm / course.distanceKm) * 100)) } : {};
      }),
    ),
  save: () => set((s) => (s.current ? { walks: [s.current, ...s.walks], current: null } : {})),
  discard: () => set({ current: null }),
}));
