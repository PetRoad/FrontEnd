import { Empty, I, Page } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { useCourseStore } from "@/stores/courseStore";

export default function MyCoursesScreen() {
  const courses = useCourseStore((s) => s.courses);
  const mine = courses.filter((c) => c.mine);

  return (
    <Page contentStyle={{ gap: 14 }}>
      {mine.length === 0 && (
        <Empty icon={I.map} title="아직 만든 코스가 없어요" body="산책을 마치고 '코스로 등록하여 공유'를 누르면 여기에 모여요." />
      )}
      {mine.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </Page>
  );
}
