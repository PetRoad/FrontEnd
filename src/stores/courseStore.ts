import { create } from "zustand";
import type { Course } from "@/types/course";

type NewCourse = Omit<Course, "id" | "likes" | "fromMeKm" | "mine">;

type CourseState = {
  courses: Course[];
  liked: string[];
  toggleLike: (id: string) => void;
  add: (course: NewCourse) => void;
};

// 1.5km 안에 2개뿐이라 처음엔 3km로 확장됨. 내 코스를 등록하면 1.5km로 좁혀짐
const seed: Course[] = [
  { id: "c1", name: "성북천 한바퀴", likes: 75, distanceKm: 2.4, difficulty: "쉬움", tags: ["물가", "평지"], breed: "포메라니안", dogAge: 3, fromMeKm: 1.3 },
  { id: "c2", name: "정릉 숲길", likes: 42, distanceKm: 3.1, difficulty: "보통", tags: ["그늘많음", "한적함"], breed: "진돗개", dogAge: 5, fromMeKm: 0.6 },
  { id: "c3", name: "낙산공원 야경길", likes: 120, distanceKm: 1.8, difficulty: "어려움", tags: ["야경", "공원"], breed: "말티즈", dogAge: 2, fromMeKm: 2.6 },
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
}));
