import { useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Chip, Field, Group, Num, Page, Plate, Row, Section, Segmented, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { useTheme } from "@/hooks/useTheme";
import { errorMessage } from "@/services/api";
import { createCourse } from "@/services/course";
import { saveWalk } from "@/services/walk";
import { useUserStore } from "@/stores/userStore";
import { useWalkStore } from "@/stores/walkStore";
import type { Difficulty } from "@/types/course";
import type { Walk } from "@/types/walk";
import { ageFromBirth } from "@/utils/format";

const TAGS = [
  "그늘많음", "공원", "물가", "숲길", "흙길", "평지", "오르막", "계단",
  "한적함", "사람많음", "야경", "벚꽃", "단풍", "카페거리", "벤치", "반려견놀이터",
];
const DIFFICULTIES = ["쉬움", "보통", "어려움"] as const;

export default function CourseRegisterScreen() {
  const c = useTheme();
  const walk = useWalkStore((s) => s.current);
  const dog = useUserStore((s) => s.dog);
  // 결과 화면에서 정한 이름·대표 사진을 그대로 이어받는다
  const [name, setName] = useState(walk?.title ?? "");
  const [cover, setCover] = useState(walk?.cover ?? walk?.photos[0]); // 고르지 않으면 첫 사진
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("쉬움");
  const dogAge = dog ? ageFromBirth(dog.birth) : 0;
  // 코스를 올린 뒤 산책일지를 저장한다. 산책일지 저장만 실패해서 다시 누르면 코스는 또 올리지 않는다
  const created = useRef(false);
  const sharing = useMutation({
    mutationFn: async (w: Walk) => {
      if (!created.current) {
        await createCourse(w, { name: name.trim(), cover, tags, difficulty });
        created.current = true;
      }
      await saveWalk(w);
    },
    onSuccess: () => {
      useWalkStore.getState().discard();
      router.dismissAll();
      router.push("/my/courses");
    },
    onError: (e) => Alert.alert("코스를 공유하지 못했어요.", errorMessage(e)),
  });

  if (!walk) return null;

  const toggleTag = (tag: string) =>
    setTags(tags.includes(tag) ? tags.filter((x) => x !== tag) : tags.length < 3 ? [...tags, tag] : tags);

  const share = () => {
    if (!name.trim()) return Alert.alert("코스 이름을 정해주세요.", "다른 보호자가 코스를 알아볼 수 있는 이름이면 좋아요.");
    if ((walk.route?.length ?? 0) < 2) return Alert.alert("걸은 경로가 너무 짧아요.", "경로가 기록된 산책만 코스로 등록할 수 있어요.");
    sharing.mutate(walk);
  };

  return (
    <Page>
      <Section title="커버 사진" hint="오늘 찍은 사진 중에서 골라요">
        <PhotoGrid photos={walk.photos} selected={cover} onPress={setCover} />
      </Section>

      <Section title="코스 이름">
        <Field value={name} onChangeText={setName} placeholder="성북천 한바퀴" maxLength={30} />
      </Section>

      <Section title="특징 태그" hint={`${tags.length}/3`}>
        <View style={s.tags}>
          {TAGS.map((tag) => (
            <Chip key={tag} label={tag} on={tags.includes(tag)} onPress={() => toggleTag(tag)} />
          ))}
        </View>
      </Section>

      <Section title="난이도">
        <Segmented options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
      </Section>

      <Section title="자동으로 들어가는 정보">
        <Group>
          <Row
            title="거리"
            detail={
              <Num size={16} color={c.textSecondary}>
                {walk.distanceKm.toFixed(2)} km
              </Num>
            }
          />
          <Row title="견종" detail={<T muted>{dog?.breed}</T>} />
          <Row title="나이" detail={<T muted>{dogAge}살</T>} />
          <Row title="경로" detail={<T muted>오늘 걸은 GPS 경로</T>} />
        </Group>
      </Section>

      <Plate title="공유하기" onPress={share} loading={sharing.isPending} />
    </Page>
  );
}

const s = StyleSheet.create({
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
