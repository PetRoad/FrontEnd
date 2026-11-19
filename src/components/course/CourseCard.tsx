import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { router } from "expo-router";
import { I, Icon, Num, PhotoTile, T, Tag } from "@/components/common/ui";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Course, Difficulty } from "@/types/course";
import { floorKm } from "@/utils/format";

// 난이도는 카드에서 가장 중요한 태그라 primarySoft로 둔다
export function DifficultyMark({ difficulty }: { difficulty: Difficulty }) {
  return (
    <View accessible accessibilityLabel={`난이도 ${difficulty}`}>
      <Tag label={difficulty} soft />
    </View>
  );
}

// 코스를 만든 사람의 반려견. 나이는 생년월일이 없으면 빠진다
export const dogLine = (c: Course) => [c.breed, c.dogAge !== undefined && `${c.dogAge}살`].filter(Boolean).join(" · ");

// 모든 카드가 같은 순서: 커버 / 코스명 / 거리·난이도·좋아요 / 견종·나이
// 가로 카드(width 지정) 높이 228 = 테두리 2 + 안쪽 여백 8 + 커버 112 + 본문 106. 바뀌면 산책 홈 PEEK도 맞춘다
// picked: 지도에서 마커를 눌러 고른 코스. 테두리를 로고색으로 바꾼다
export function CourseCard({ course, width, picked }: { course: Course; width?: number; picked?: boolean }) {
  const c = useTheme();
  const { liked } = course;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${floorKm(course.distanceKm)}킬로미터, 난이도 ${course.difficulty}, 좋아요 ${course.likes}`}
      onPress={() => router.push({ pathname: "/course/[id]", params: { id: course.id } })}
      style={({ pressed }) => [s.card, { backgroundColor: c.surface, borderColor: picked ? c.primary : c.borderSubtle, width, opacity: pressed ? 0.85 : 1 }]}
    >
      <PhotoTile label={course.cover ?? "커버 이미지"} style={[s.cover, { height: width ? 112 : 160 }]} />
      <View style={s.body}>
        <T v="bodyMain" numberOfLines={1}>
          {course.name}
        </T>
        <View style={s.line}>
          <View style={s.km}>
            <Num size={16} bold>
              {floorKm(course.distanceKm)}
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
          {dogLine(course)}
        </T>
      </View>
    </Pressable>
  );
}

// 산책 홈 추천 코스를 받는 동안 가로 카드 자리를 미리 그린다. 시스템 동작 줄이기가 켜져 있으면 깜빡이지 않는다
export function CourseSkeleton() {
  const c = useTheme();
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.set(withRepeat(withTiming(0.5, { duration: 800 }), -1, true));
  }, [pulse]);
  const fade = useAnimatedStyle(() => ({ opacity: pulse.get() }));
  const bar = (width: number | `${number}%`, height: number) => <View style={{ width, height, borderRadius: 6, backgroundColor: c.surfaceMuted }} />;

  return (
    <Animated.View accessible accessibilityLabel="추천 코스를 불러오는 중" style={[s.skeletonRow, fade]}>
      {[0, 1].map((i) => (
        <View key={i} style={[s.card, { width: 232, height: 228, backgroundColor: c.surface, borderColor: c.borderSubtle }]}>
          <View style={[s.cover, { height: 112, backgroundColor: c.surfaceMuted }]} />
          <View style={[s.body, { gap: space.md }]}>
            {bar("70%", 20)}
            {bar("45%", 16)}
            {bar("55%", 14)}
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  skeletonRow: { flexDirection: "row", gap: space.md, paddingHorizontal: space.xl, overflow: "hidden" },
  card: { borderRadius: radius.card, borderWidth: 1, padding: space.xs },
  cover: { borderRadius: radius.image },
  body: { paddingHorizontal: space.md, paddingVertical: space.md, gap: 6 },
  line: { flexDirection: "row", alignItems: "center", gap: space.sm, height: 24 },
  km: { flexDirection: "row", alignItems: "baseline", gap: 2 },
});
