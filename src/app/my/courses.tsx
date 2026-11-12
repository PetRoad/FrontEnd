import { Empty, I, Page } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { space } from "@/constants/theme";
import { errorMessage } from "@/services/api";
import { useMyCourses } from "@/services/course";

export default function MyCoursesScreen() {
  const { data: list, error } = useMyCourses();

  return (
    <Page contentStyle={{ gap: space.md }}>
      {error && <Empty icon={I.map} title="코스를 불러오지 못했어요" body={errorMessage(error)} />}
      {list?.length === 0 && (
        <Empty icon={I.map} title="아직 만든 코스가 없어요" body="산책을 마치고 '코스로 등록하여 공유'를 누르면 여기에 모여요." />
      )}
      {list?.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </Page>
  );
}
