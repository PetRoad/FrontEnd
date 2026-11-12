import { Tracker } from "@/components/walk/Tracker";
import { useCourse } from "@/services/course";
import { useWalkStore } from "@/stores/walkStore";

// 코스 상세에서 넘어오므로 코스는 이미 받아 둔 것을 쓴다
export default function FollowWalkScreen() {
  const courseId = useWalkStore((s) => s.current?.courseId);
  const { data: course } = useCourse(courseId);
  return <Tracker course={course} />;
}
