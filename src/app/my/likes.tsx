import { Empty, I, Page } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { useCourseStore } from "@/stores/courseStore";

export default function LikedCoursesScreen() {
  const courses = useCourseStore((s) => s.courses);
  const liked = useCourseStore((s) => s.liked);
  const list = courses.filter((c) => liked.includes(c.id));

  return (
    <Page contentStyle={{ gap: 14 }}>
      {list.length === 0 && (
        <Empty icon={I.heart} title="좋아요한 코스가 없어요" body="코스 상세에서 좋아요를 누르면 나중에 여기서 다시 찾을 수 있어요." />
      )}
      {list.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </Page>
  );
}
