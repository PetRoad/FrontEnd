import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { MapPlate } from "@/components/common/MapPlate";
import { BottomBar, Btn, Field, I, Page, Plate, Section, Stat, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import { confirm } from "@/utils/confirm";
import { clock, dotDate } from "@/utils/format";

export default function WalkResultScreen() {
  const c = useTheme();
  const walk = useWalkStore((s) => s.current);
  if (!walk) return null;
  // 자유산책만 이름·대표 사진을 정한다. 따라 걷기는 코스 이름 그대로
  const free = !walk.courseId;
  const { edit } = useWalkStore.getState();

  // 저장과 코스 공유 모두 산책일지에 남으니 이름이 있어야 한다
  const named = () => !!walk.title.trim() || (Alert.alert("산책 이름을 정해주세요."), false);

  const save = () => {
    if (!named()) return;
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
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <Page contentStyle={{ paddingBottom: 260 }}>
        <View style={{ gap: space.xs }}>
          <T v="titleLG">오늘도 잘 걸었어요</T>
          <T v="bodySmall" muted>
            {dotDate(walk.date)} · {walk.title}
          </T>
        </View>

        {/* 거리를 가장 크게, 산책 시간은 아랫줄 맨 앞 */}
        <View style={[s.band, { backgroundColor: c.primarySoft }]}>
          <Stat value={walk.distanceKm.toFixed(2)} unit="km" label="거리" size={56} />
          <View style={[s.stats, { borderTopColor: c.borderStrong }]}>
            <Stat value={clock(walk.durationSec)} label="산책 시간" size={28} />
            {walk.completion !== undefined && <Stat value={String(walk.completion)} unit="%" label="코스 완주율" size={28} />}
            <Stat value={String(walk.photos.length)} unit="장" label="사진" size={28} />
          </View>
        </View>

        {free && (
          <Section title="산책 이름">
            <Field value={walk.title} onChangeText={(title) => edit({ title })} placeholder="성북천 한바퀴" maxLength={30} />
          </Section>
        )}

        <Section title="걸은 경로">
          <MapPlate style={s.map} route={walk.route} />
        </Section>

        <Section title={free ? "대표 사진" : "산책 중 찍은 사진"} hint={free && walk.photos.length ? "찍은 사진 중에서 골라요" : `${walk.photos.length}장`}>
          <PhotoGrid photos={walk.photos} selected={free ? walk.cover : undefined} onPress={free ? (cover) => edit({ cover }) : undefined} />
        </Section>
      </Page>

      <BottomBar>
        <Plate title="기록 저장" onPress={save} />
        {/* 남의 코스를 따라 걸은 기록은 내 코스로 등록하지 않음 (스케치 흐름 그대로 유지) */}
        {!walk.courseId && <Btn title="코스로 등록하여 공유" icon={I.map} onPress={() => named() && router.push("/walk/register")} />}
        <Btn tone="plain" title="기록 버리기" onPress={discard} />
      </BottomBar>
    </View>
  );
}

const s = StyleSheet.create({
  band: { borderRadius: radius.cardLg, padding: space.xl, gap: space.xl },
  stats: { flexDirection: "row", flexWrap: "wrap", columnGap: space.xxl, rowGap: space.md, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
  map: { height: 200, borderRadius: radius.card },
});
