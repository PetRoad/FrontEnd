import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { I, Icon, Num, PhotoTile, T, Tag } from "@/components/common/ui";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import type { Course, Difficulty } from "@/types/course";

// 난이도는 카드에서 가장 중요한 태그라 Cream Beige로 둔다
export function DifficultyMark({ difficulty }: { difficulty: Difficulty }) {
  return (
    <View accessible accessibilityLabel={`난이도 ${difficulty}`}>
      <Tag label={difficulty} soft />
    </View>
  );
}

// 모든 카드가 같은 순서: 커버 / 코스명 / 거리·난이도·좋아요 / 견종·나이
// 가로 카드(width 지정) 높이 228 = 테두리 2 + 안쪽 여백 8 + 커버 112 + 본문 106. 바뀌면 산책 홈 PEEK도 맞춘다
export function CourseCard({ course, width }: { course: Course; width?: number }) {
  const c = useTheme();
  const liked = useCourseStore((s) => s.liked.includes(course.id));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.distanceKm}킬로미터, 난이도 ${course.difficulty}, 좋아요 ${course.likes}`}
      onPress={() => router.push({ pathname: "/course/[id]", params: { id: course.id } })}
      style={({ pressed }) => [s.card, { backgroundColor: c.surface, borderColor: c.borderSubtle, width, opacity: pressed ? 0.85 : 1 }]}
    >
      <PhotoTile label={course.cover ?? "커버 이미지"} style={[s.cover, { height: width ? 112 : 160 }]} />
      <View style={s.body}>
        <T v="bodyMain" numberOfLines={1}>
          {course.name}
        </T>
        <View style={s.line}>
          <View style={s.km}>
            <Num size={16} bold>
              {course.distanceKm.toFixed(1)}
            </Num>
            <Num size={13} color={c.textSecondary}>
              km
            </Num>
          </View>
          <DifficultyMark difficulty={course.difficulty} />
          <View style={{ flex: 1 }} />
          <Icon name={liked ? I.heartFill : I.heart} size={14} color={liked ? c.textPrimary : c.textSecondary} />
          <Num size={14} color={c.textSecondary}>
            {course.likes}
          </Num>
        </View>
        <T v="bodySmall" muted numberOfLines={1}>
          {course.breed} · {course.dogAge}살
        </T>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: radius.card, borderWidth: 1, padding: space.xs },
  cover: { borderRadius: radius.image },
  body: { paddingHorizontal: space.md, paddingVertical: space.md, gap: 6 },
  line: { flexDirection: "row", alignItems: "center", gap: space.sm, height: 24 },
  km: { flexDirection: "row", alignItems: "baseline", gap: 2 },
});
