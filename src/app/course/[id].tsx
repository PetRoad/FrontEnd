import { Alert, Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { LayoutAnimationConfig, ZoomIn } from "react-native-reanimated";
import { MapPlate } from "@/components/common/MapPlate";
import { BottomBar, Btn, Empty, Group, I, Icon, Num, Page, PhotoTile, Plate, Row, Section, T, Tag } from "@/components/common/ui";
import { DifficultyMark, dogLine } from "@/components/course/CourseCard";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { ApiError, errorMessage } from "@/services/api";
import { deleteCourse, toggleLike, useCourse } from "@/services/course";
import { useWalkStore } from "@/stores/walkStore";
import { confirm } from "@/utils/confirm";
import { floorKm } from "@/utils/format";

export default function CourseDetailScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: course, error, isPending } = useCourse(id);

  if (isPending) return <Page />;
  if (!course) {
    const gone = error instanceof ApiError && error.status === 404;
    return (
      <Page>
        <Empty
          icon={I.map}
          title={gone ? "코스를 찾을 수 없어요" : "코스를 불러오지 못했어요"}
          body={gone ? "삭제되었거나 더 이상 공개되지 않는 코스예요." : errorMessage(error)}
        />
      </Page>
    );
  }
  const { liked } = course;
  const dog = dogLine(course);

  const follow = () => {
    useWalkStore.getState().start(course.name, course.id);
    router.push("/walk/follow");
  };

  // 코스만 지운다. 같은 산책의 산책일지 기록은 남는다
  const remove = () =>
    confirm({
      title: "코스를 삭제할까요?",
      message: "삭제한 코스는 되돌릴 수 없어요. 산책일지 기록은 남아요.",
      ok: "삭제",
      destructive: true,
      // 먼저 돌아가고, 실패하면 목록에 그대로 남은 채로 알린다
      onOk: () => {
        router.back();
        deleteCourse(course.id).catch((e) => Alert.alert("코스를 삭제하지 못했어요.", errorMessage(e)));
      },
    });

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Page contentStyle={{ paddingBottom: 120 }}>
        <PhotoTile label={course.cover ?? "커버 이미지"} style={s.cover} />

        <View style={{ gap: space.md }}>
          <T v="titleLG">{course.name}</T>
          <View style={s.facts}>
            <View style={s.km}>
              <Num size={28} bold>
                {floorKm(course.distanceKm)}
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

        {!!dog && (
          <Group>
            <Row icon={I.paw} title={dog} sub="이 코스를 걸은 반려견" />
          </Group>
        )}

        <Section title="코스 경로">
          <MapPlate style={s.map} route={course.route} />
        </Section>

        {course.mine && <Btn tone="plain" title="코스 삭제" onPress={remove} />}
      </Page>

      <BottomBar>
        <View style={s.row}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? `좋아요 취소, ${course.likes}` : `좋아요, ${course.likes}`}
            accessibilityState={{ selected: liked }}
            onPress={() => toggleLike(course).catch((e) => Alert.alert("좋아요를 바꾸지 못했어요.", errorMessage(e)))}
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
