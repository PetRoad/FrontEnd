import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { I, Icon, Num, PhotoTile, T, shadow } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import type { Course, Difficulty } from "@/types/course";

const LEVEL: Record<Difficulty, number> = { 쉬움: 1, 보통: 2, 어려움: 3 };

// 난이도: 점 3개 중 채워진 점 수
export function DifficultyMark({ difficulty }: { difficulty: Difficulty }) {
  const c = useTheme();
  return (
    <View style={s.level} accessibilityLabel={`난이도 ${difficulty}`}>
      <View style={s.dashes}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[s.dash, { backgroundColor: i <= LEVEL[difficulty] ? c.accent : c.fill }]} />
        ))}
      </View>
      <T v="footnote" muted>
        {difficulty}
      </T>
    </View>
  );
}

// 모든 카드가 같은 라벨 그리드: 코스명 / 거리·난이도·좋아요 / 견종·나이
export function CourseCard({ course, width }: { course: Course; width?: number }) {
  const c = useTheme();
  const liked = useCourseStore((s) => s.liked.includes(course.id));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${course.distanceKm}킬로미터, ${course.difficulty}, 좋아요 ${course.likes}`}
      onPress={() => router.push({ pathname: "/course/[id]", params: { id: course.id } })}
      style={({ pressed }) => [s.card, { backgroundColor: c.surface, borderColor: c.hairline, width, opacity: pressed ? 0.85 : 1 }, shadow]}
    >
      <PhotoTile label={course.cover ?? "커버 이미지"} style={s.cover} />
      <View style={s.body}>
        <T v="headline" numberOfLines={1}>
          {course.name}
        </T>
        <View style={s.line}>
          <View style={s.km}>
            <Num size={22} bold>
              {course.distanceKm.toFixed(1)}
            </Num>
            <Num size={13} color={c.inkMuted}>
              KM
            </Num>
          </View>
          <DifficultyMark difficulty={course.difficulty} />
          <View style={{ flex: 1 }} />
          <Icon name={liked ? I.heartFill : I.heart} size={14} color={liked ? c.tint : c.inkMuted} />
          <Num size={17} color={c.inkMuted}>
            {course.likes}
          </Num>
        </View>
        <T v="subhead" muted numberOfLines={1}>
          {course.breed} · {course.dogAge}살
        </T>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 18, overflow: "hidden", borderWidth: 1 },
  cover: { height: 104, borderRadius: 0 },
  body: { padding: 12, gap: 4 },
  line: { flexDirection: "row", alignItems: "center", gap: 10 },
  km: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  level: { flexDirection: "row", alignItems: "center", gap: 5 },
  dashes: { flexDirection: "row", gap: 2 },
  dash: { width: 8, height: 8, borderRadius: 4 },
});
