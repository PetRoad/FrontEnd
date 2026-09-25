import { Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BottomBar, Chip, Empty, Group, I, Icon, MapPlate, Num, Page, PhotoTile, Plate, Row, Section, T } from "@/components/common/ui";
import { DifficultyMark } from "@/components/course/CourseCard";
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
    <View style={{ flex: 1, backgroundColor: c.ground }}>
      <Page contentStyle={{ paddingBottom: 120 }}>
        <PhotoTile label={course.cover ?? "커버 이미지"} style={s.cover} />

        <View style={{ gap: 12 }}>
          <T v="title1">{course.name}</T>
          <View style={s.facts}>
            <View style={s.km}>
              <Num size={34} bold>
                {course.distanceKm.toFixed(1)}
              </Num>
              <Num size={15} color={c.inkMuted}>
                KM
              </Num>
            </View>
            <DifficultyMark difficulty={course.difficulty} />
          </View>
          {course.tags.length > 0 && (
            <View style={s.tags}>
              {course.tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          )}
        </View>

        <Group>
          <Row title={`${course.breed} · ${course.dogAge}살`} sub="이 코스를 걸은 반려견" />
        </Group>

        <Section title="코스 경로">
          <MapPlate style={s.map} />
        </Section>
      </Page>

      <BottomBar>
        <View style={s.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? "좋아요 취소" : "좋아요"}
          accessibilityState={{ selected: liked }}
          onPress={() => useCourseStore.getState().toggleLike(course.id)}
          style={({ pressed }) => [
            s.like,
            { backgroundColor: c.surface, borderColor: liked ? c.tint : c.hairline, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Icon name={liked ? I.heartFill : I.heart} size={20} color={liked ? c.tint : c.ink} />
          <Num size={20} color={liked ? c.tint : c.ink}>
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
  cover: { height: 220, borderRadius: 16 },
  facts: { flexDirection: "row", alignItems: "center", gap: 18 },
  km: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  map: { height: 220, borderRadius: 16 },
  row: { flexDirection: "row", gap: 10 },
  like: { height: 56, minWidth: 88, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
});
