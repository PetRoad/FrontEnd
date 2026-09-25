import { Tracker } from "@/components/walk/Tracker";
import { useCourseStore } from "@/stores/courseStore";
import { useWalkStore } from "@/stores/walkStore";

export default function FollowWalkScreen() {
  const courseId = useWalkStore((s) => s.current?.courseId);
  const course = useCourseStore((s) => s.courses.find((c) => c.id === courseId));
  return <Tracker course={course} />;
}
