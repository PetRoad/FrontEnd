import { Alert, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MapPlate } from "@/components/common/MapPlate";
import { Btn, Empty, I, Page, Section, Stat, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { errorMessage } from "@/services/api";
import { deleteWalk, useWalks } from "@/services/walk";
import { confirm } from "@/utils/confirm";
import { dotDate, floorKm } from "@/utils/format";

export default function WalkDetailScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: walks, isPending } = useWalks();
  const walk = walks?.find((w) => w.id === id);

  if (isPending) return <Page />;
  if (!walk) {
    return (
      <Page>
        <Empty icon={I.log} title="산책 기록을 찾을 수 없어요" body="삭제된 기록일 수 있어요." />
      </Page>
    );
  }

  const remove = () =>
    confirm({
      title: "기록을 삭제할까요?",
      message: "삭제한 산책은 되돌릴 수 없어요.",
      ok: "삭제",
      destructive: true,
      // 먼저 목록으로 돌아가고, 실패하면 목록에 그대로 남은 채로 알린다
      onOk: () => {
        router.back();
        deleteWalk(walk.id).catch((e) => Alert.alert("기록을 삭제하지 못했어요.", errorMessage(e)));
      },
    });

  return (
    <Page>
      <View style={{ gap: space.xs }}>
        <T v="titleLG">{dotDate(walk.date)}</T>
        <T v="bodySmall" muted>
          {walk.title}
        </T>
      </View>

      <MapPlate style={s.map} route={walk.route} />

      <View style={[s.band, { backgroundColor: c.primarySoft }]}>
        <Stat value={floorKm(walk.distanceKm)} unit="km" label="거리" size={32} />
        <Stat value={String(Math.round(walk.durationSec / 60))} unit="분" label="산책 시간" size={32} />
        {walk.completion !== undefined && <Stat value={String(walk.completion)} unit="%" label="코스 완주율" size={32} />}
      </View>

      <Section title="이 산책에서 찍은 사진" hint={`${walk.photos.length}장`}>
        <PhotoGrid photos={walk.photos} />
      </Section>

      <Btn tone="plain" title="기록 삭제" onPress={remove} />
    </Page>
  );
}

const s = StyleSheet.create({
  map: { height: 220, borderRadius: radius.card },
  band: { borderRadius: radius.card, padding: space.xl, flexDirection: "row", flexWrap: "wrap", gap: space.xxxl },
});
