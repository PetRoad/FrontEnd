import { create } from "zustand";
import { useCourseStore } from "@/stores/courseStore";
import type { LatLng } from "react-native-maps";
import type { Walk } from "@/types/walk";
import { todayIso } from "@/utils/format";
import { meters } from "@/utils/location";

type WalkState = {
  current: Walk | null; // 진행 중이거나 결과 화면에서 대기 중인 산책
  start: (title: string, courseId?: string) => void;
  tick: () => void;
  move: (p: LatLng) => void;
  addPhoto: (uri: string) => void;
  edit: (patch: Partial<Pick<Walk, "title" | "cover">>) => void;
  finish: () => void;
  discard: () => void;
};

const update = (s: WalkState, patch: (w: Walk) => Partial<Walk>) =>
  s.current ? { current: { ...s.current, ...patch(s.current) } } : {};

export const useWalkStore = create<WalkState>()((set) => ({
  current: null,
  start: (title, courseId) =>
    set({ current: { id: `w${Date.now()}`, title, date: todayIso(), distanceKm: 0, durationSec: 0, photos: [], courseId, route: [] } }),
  tick: () => set((s) => update(s, (w) => ({ durationSec: w.durationSec + 1 }))),
  // GPS 점 하나 = 경로에 추가 + 직전 점과의 거리만큼 누적
  move: (p) =>
    set((s) =>
      update(s, (w) => {
        const route = w.route ?? [];
        const last = route.at(-1);
        return { route: [...route, p], distanceKm: w.distanceKm + (last ? meters(last, p) / 1000 : 0) };
      }),
    ),
  // 기기 캐시 폴더의 uri. 저장할 때 서버에 올리고 받은 주소로 바꾼다(saveWalk)
  addPhoto: (uri) => set((s) => update(s, (w) => ({ photos: [...w.photos, uri] }))),
  edit: (patch) => set((s) => update(s, () => patch)),
  // ponytail: 완주율 임시값 = 걸은 거리 ÷ 코스 거리. 기획 §17대로 경로 매칭 알고리즘이 정해지면 교체
  finish: () =>
    set((s) =>
      update(s, (w) => {
        const course = useCourseStore.getState().courses.find((c) => c.id === w.courseId);
        return course ? { completion: Math.min(100, Math.round((w.distanceKm / course.distanceKm) * 100)) } : {};
      }),
    ),
  discard: () => set({ current: null }),
}));
