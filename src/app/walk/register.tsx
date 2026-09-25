import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Chip, Field, Group, Num, Page, Plate, Row, Section, Segmented, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import { useUserStore } from "@/stores/userStore";
import { useWalkStore } from "@/stores/walkStore";
import type { Difficulty } from "@/types/course";
import { ageFromBirth } from "@/utils/format";

const TAGS = ["그늘많음", "공원", "물가", "평지", "한적함", "야경"];
const DIFFICULTIES = ["쉬움", "보통", "어려움"] as const;

export default function CourseRegisterScreen() {
  const c = useTheme();
  const walk = useWalkStore((s) => s.current);
  const dog = useUserStore((s) => s.dog);
  const [name, setName] = useState("");
  const [cover, setCover] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("쉬움");

  if (!walk) return null;
  const dogAge = dog ? ageFromBirth(dog.birth) : 0;

  const toggleTag = (tag: string) =>
    setTags(tags.includes(tag) ? tags.filter((x) => x !== tag) : tags.length < 3 ? [...tags, tag] : tags);

  const share = () => {
    if (!name.trim()) return Alert.alert("코스 이름을 정해주세요.", "다른 보호자가 코스를 알아볼 수 있는 이름이면 좋아요.");
    useCourseStore.getState().add({
      name: name.trim(),
      cover,
      tags,
      difficulty,
      distanceKm: walk.distanceKm,
      breed: dog?.breed ?? "",
      dogAge,
    });
    useWalkStore.getState().save();
    router.dismissAll();
    router.push("/my/courses");
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
              <Num size={20} color={c.inkMuted}>
                {walk.distanceKm.toFixed(2)} KM
              </Num>
            }
          />
          <Row title="견종" detail={<T muted>{dog?.breed}</T>} />
          <Row title="나이" detail={<T muted>{dogAge}살</T>} />
          <Row title="경로" detail={<T muted>오늘 걸은 GPS 경로</T>} />
        </Group>
      </Section>

      <Plate title="공유하기" onPress={share} />
    </Page>
  );
}

const s = StyleSheet.create({
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
