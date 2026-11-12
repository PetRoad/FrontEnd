import { create } from "zustand";
import type { LatLng } from "react-native-maps";
import type { Course } from "@/types/course";

type NewCourse = Omit<Course, "id" | "likes" | "fromMeKm" | "mine">;

type CourseState = {
  courses: Course[];
  liked: string[];
  toggleLike: (id: string) => void;
  add: (course: NewCourse) => void;
  remove: (id: string) => void;
};

// 한성대학교 정문길 테스트 경로. 정문에서 삼선교로16길을 따라 북쪽으로 430m (OSM 도로 좌표, distanceKm는 이 점들을 이은 길이)
// ponytail: 개발자가 바로 걸어볼 수 있게 둔 목데이터. 코스 API가 붙으면 통째로 사라진다
const TEST_ROUTE: LatLng[] = [
  { latitude: 37.5823637, longitude: 127.0111616 },
  { latitude: 37.5825906, longitude: 127.0111588 },
  { latitude: 37.58314, longitude: 127.0111398 },
  { latitude: 37.583458, longitude: 127.0111119 },
  { latitude: 37.5835749, longitude: 127.0111069 },
  { latitude: 37.5839402, longitude: 127.0110913 },
  { latitude: 37.5843979, longitude: 127.0110621 },
  { latitude: 37.5845879, longitude: 127.0110535 },
  { latitude: 37.584734, longitude: 127.0110401 },
  { latitude: 37.585157, longitude: 127.0109963 },
  { latitude: 37.5854426, longitude: 127.0109832 },
  { latitude: 37.5854756, longitude: 127.0109817 },
  { latitude: 37.5859704, longitude: 127.0109569 },
  { latitude: 37.5860572, longitude: 127.0109446 },
  { latitude: 37.58623, longitude: 127.01092 },
];

// 1.5km 안에 2개뿐이라 처음엔 3km로 확장됨. 내 코스를 등록하면 1.5km로 좁혀짐
const seed: Course[] = [
  { id: "c1", name: "성북천 한바퀴", likes: 75, distanceKm: 2.4, difficulty: "쉬움", tags: ["물가", "평지"], breed: "포메라니안", dogAge: 3, fromMeKm: 1.3 },
  { id: "c2", name: "정릉 숲길", likes: 42, distanceKm: 3.1, difficulty: "보통", tags: ["그늘많음", "한적함"], breed: "진돗개", dogAge: 5, fromMeKm: 0.6 },
  { id: "c3", name: "한성대학교 정문길", likes: 120, distanceKm: 0.43, difficulty: "어려움", tags: ["야경", "공원"], breed: "말티즈", dogAge: 2, fromMeKm: 2.6, route: TEST_ROUTE },
  { id: "c4", name: "개운산 둘레길", likes: 42, distanceKm: 2.9, difficulty: "보통", tags: ["그늘많음", "공원"], breed: "비숑", dogAge: 4, fromMeKm: 1.9 },
  { id: "c5", name: "북악 스카이웨이", likes: 210, distanceKm: 6.5, difficulty: "어려움", tags: ["야경"], breed: "보더콜리", dogAge: 6, fromMeKm: 4.2 },
];

export const useCourseStore = create<CourseState>()((set) => ({
  courses: seed,
  liked: [],
  toggleLike: (id) =>
    set((s) => {
      const on = s.liked.includes(id);
      return {
        liked: on ? s.liked.filter((x) => x !== id) : [...s.liked, id],
        courses: s.courses.map((c) => (c.id === id ? { ...c, likes: c.likes + (on ? -1 : 1) } : c)),
      };
    }),
  add: (course) =>
    set((s) => ({
      courses: [{ ...course, id: `c${Date.now()}`, likes: 0, fromMeKm: 0, mine: true }, ...s.courses],
    })),
  remove: (id) =>
    set((s) => ({
      courses: s.courses.filter((c) => c.id !== id),
      liked: s.liked.filter((x) => x !== id),
    })),
}));
