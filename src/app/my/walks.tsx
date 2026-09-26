import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Empty, Group, I, Num, Page, PhotoTile, Row, T } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import { dotDate } from "@/utils/format";

export default function WalksScreen() {
  const c = useTheme();
  const walks = useWalkStore((s) => s.walks);

  return (
    <Page>
      {walks.length === 0 ? (
        <Empty icon={I.log} title="아직 저장한 산책이 없어요" body="산책을 마치고 기록을 저장하면 여기에 쌓여요." />
      ) : (
        <Group>
          {walks.map((w) => (
            <Row
              key={w.id}
              left={<PhotoTile icon={w.photos.length ? I.photo : I.walk} style={s.thumb} />}
              title={
                <View style={{ gap: 2 }}>
                  <Num size={20} bold>
                    {dotDate(w.date)}
                  </Num>
                  <T v="subhead" muted numberOfLines={1}>
                    {w.title}
                  </T>
                </View>
              }
              detail={
                <View style={s.detail}>
                  <Num size={20}>{w.distanceKm.toFixed(1)} KM</Num>
                  <Num size={15} color={c.inkMuted}>
                    {Math.round(w.durationSec / 60)}분
                  </Num>
                </View>
              }
              onPress={() => router.push({ pathname: "/my/walk/[id]", params: { id: w.id } })}
            />
          ))}
        </Group>
      )}
    </Page>
  );
}

const s = StyleSheet.create({
  thumb: { width: 56, height: 56, borderRadius: 8, padding: 0 },
  detail: { alignItems: "flex-end", gap: 2 },
});
