import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Empty, I, MapPlate, Num, Page, Section, Stat, T } from "@/components/common/ui";
import { PhotoGrid } from "@/components/walk/PhotoGrid";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import { dotDate } from "@/utils/format";

export default function WalkDetailScreen() {
  const c = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const walk = useWalkStore((s) => s.walks.find((w) => w.id === id));

  if (!walk) {
    return (
      <Page>
        <Empty icon={I.log} title="산책 기록을 찾을 수 없어요" body="삭제된 기록일 수 있어요." />
      </Page>
    );
  }

  return (
    <Page>
      <View style={{ gap: 4 }}>
        <Num size={34} bold>
          {dotDate(walk.date)}
        </Num>
        <T v="subhead" muted>
          {walk.title}
        </T>
      </View>

      <MapPlate style={s.map} marker />

      <View style={[s.band, { backgroundColor: c.accentSoft }]}>
        <Stat value={walk.distanceKm.toFixed(1)} unit="KM" label="거리" size={40} />
        <Stat value={String(Math.round(walk.durationSec / 60))} unit="분" label="시간" size={40} />
        {walk.completion !== undefined && <Stat value={String(walk.completion)} unit="%" label="코스 완주율" size={40} />}
      </View>

      <Section title="이 산책에서 찍은 사진" hint={`${walk.photos.length}장`}>
        <PhotoGrid photos={walk.photos} />
      </Section>
    </Page>
  );
}

const s = StyleSheet.create({
  map: { height: 220, borderRadius: 16 },
  band: { borderRadius: 20, padding: 20, flexDirection: "row", flexWrap: "wrap", gap: 32 },
});
