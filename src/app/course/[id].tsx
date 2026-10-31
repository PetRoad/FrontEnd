import { Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { LayoutAnimationConfig, ZoomIn } from "react-native-reanimated";
import { MapPlate } from "@/components/common/MapPlate";
import { BottomBar, Empty, Group, I, Icon, Num, Page, PhotoTile, Plate, Row, Section, T, Tag } from "@/components/common/ui";
import { DifficultyMark } from "@/components/course/CourseCard";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import { useWalkStore } from "@/stores/walkStore";

export default function CourseDetailScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = useCourseStore((s) => s.courses.find((x) => x.id === id));
  const liked = useCourseStore((s) => s.liked.includes(id));

  if (!course) {
    return (
      <Page>
        <Empty icon={I.map} title="코스를 찾을 수 없어요" body="삭제되었거나 더 이상 공개되지 않는 코스예요." />
      </Page>
    );
  }

  const follow = () => {
    useWalkStore.getState().start(course.name, course.id);
    router.push("/walk/follow");
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Page contentStyle={{ paddingBottom: 120 }}>
        <PhotoTile label={course.cover ?? "커버 이미지"} style={s.cover} />

        <View style={{ gap: space.md }}>
          <T v="titleLG">{course.name}</T>
          <View style={s.facts}>
            <View style={s.km}>
              <Num size={28} bold>
                {course.distanceKm.toFixed(1)}
              </Num>
              <Num size={15} color={c.textSecondary}>
                km
              </Num>
            </View>
            <DifficultyMark difficulty={course.difficulty} />
          </View>
          {course.tags.length > 0 && (
            <View style={s.tags}>
              {course.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </View>
          )}
        </View>

        <Group>
          <Row icon={I.paw} title={`${course.breed} · ${course.dogAge}살`} sub="이 코스를 걸은 반려견" />
        </Group>

        <Section title="코스 경로">
          <MapPlate style={s.map} />
        </Section>
      </Page>

      <BottomBar>
        <View style={s.row}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? `좋아요 취소, ${course.likes}` : `좋아요, ${course.likes}`}
            accessibilityState={{ selected: liked }}
            onPress={() => useCourseStore.getState().toggleLike(course.id)}
            style={({ pressed }) => [
              s.like,
              { backgroundColor: liked ? (pressed ? c.primarySoftPressed : c.primarySoft) : pressed ? c.borderSubtle : c.surfaceMuted },
            ]}
          >
            {/* 처음 열 때는 그대로, 누를 때만 하트가 살짝 커지며 바뀐다 */}
            <LayoutAnimationConfig skipEntering>
              <Animated.View key={String(liked)} entering={ZoomIn.duration(180)}>
                <Icon name={liked ? I.heartFill : I.heart} size={20} color={liked ? c.primaryDeep : undefined} />
              </Animated.View>
            </LayoutAnimationConfig>
            <Num size={16} color={liked ? c.primaryDeep : undefined}>
              {course.likes}
            </Num>
          </Pressable>
          <Plate title="이 코스 따라 걷기" icon={I.walk} onPress={follow} style={{ flex: 1 }} />
        </View>
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  cover: { height: 220, borderRadius: radius.card },
  facts: { flexDirection: "row", alignItems: "center", gap: space.md },
  km: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  map: { height: 200, borderRadius: radius.card },
  row: { flexDirection: "row", gap: space.md },
  like: { height: 56, minWidth: 80, paddingHorizontal: space.lg, borderRadius: radius.button, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
});
