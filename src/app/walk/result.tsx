import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { BottomBar, Btn, I, MapPlate, Page, Plate, Section, Stat, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import { confirm } from "@/utils/confirm";
import { clock, dotDate } from "@/utils/format";

export default function WalkResultScreen() {
  const c = useTheme();
  const walk = useWalkStore((s) => s.current);
  if (!walk) return null;

  const save = () => {
    useWalkStore.getState().save();
    router.dismissAll();
    router.push("/my/walks");
  };

  const discard = () =>
    confirm({
      title: "기록을 버릴까요?",
      message: "버린 산책은 되돌릴 수 없어요.",
      ok: "버리기",
      destructive: true,
      onOk: () => {
        useWalkStore.getState().discard();
        router.dismissAll();
      },
    });

  return (
    <View style={{ flex: 1 }}>
    <Page contentStyle={{ paddingBottom: 260 }}>
      <View style={{ gap: 6 }}>
        <T v="title1">오늘도 잘 걸었어요</T>
        <T v="subhead" muted>
          {dotDate(walk.date)} · {walk.title}
        </T>
      </View>

      <View style={[s.band, { backgroundColor: c.track }]}>
        <Stat value={walk.distanceKm.toFixed(2)} unit="KM" label="거리" size={72} onTrack />
        <View style={s.stats}>
          <Stat value={clock(walk.durationSec)} label="시간" size={30} onTrack />
          {walk.completion !== undefined && <Stat value={String(walk.completion)} unit="%" label="코스 완주율" size={30} onTrack />}
          <Stat value={String(walk.photos.length)} unit="장" label="사진" size={30} onTrack />
        </View>
      </View>

      <Section title="걸은 경로">
        <MapPlate style={s.map} marker />
      </Section>

      <Section title="산책 중 찍은 사진" hint={`${walk.photos.length}장`}>
        <PhotoGrid photos={walk.photos} />
      </Section>

    </Page>

    <BottomBar>
      <Plate title="기록 저장" onPress={save} />
      {/* 남의 코스를 따라 걸은 기록은 내 코스로 등록하지 않음 (스케치 흐름 그대로 유지) */}
      {!walk.courseId && <Btn title="코스로 등록하여 공유" icon={I.map} onPress={() => router.push("/walk/register")} />}
      <Btn tone="plain" title="기록 버리기" onPress={discard} />
    </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  band: { borderRadius: 20, padding: 20, gap: 18 },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 28 },
  map: { height: 200, borderRadius: 16 },
});
