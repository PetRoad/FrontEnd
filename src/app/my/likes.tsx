import { Empty, I, Page } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { space } from "@/constants/theme";
import { errorMessage } from "@/services/api";
import { useLikedCourses } from "@/services/course";

export default function LikedCoursesScreen() {
  const { data: list, error } = useLikedCourses();

  return (
    <Page contentStyle={{ gap: space.md }}>
      {error && <Empty icon={I.heart} title="코스를 불러오지 못했어요" body={errorMessage(error)} />}
      {list?.length === 0 && (
        <Empty icon={I.heart} title="좋아요한 코스가 없어요" body="코스 상세에서 좋아요를 누르면 나중에 여기서 다시 찾을 수 있어요." />
      )}
      {list?.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </Page>
  );
}
