import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Empty, Group, I, Num, Page, PhotoTile, Row, T } from "@/components/common/ui";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { errorMessage } from "@/services/api";
import { useWalks } from "@/services/walk";
import { dotDate, floorKm } from "@/utils/format";

export default function WalksScreen() {
  const c = useTheme();
  const { data: walks, error } = useWalks();

  if (error) {
    return (
      <Page>
        <Empty icon={I.log} title="산책일지를 불러오지 못했어요" body={errorMessage(error)} />
      </Page>
    );
  }
  if (!walks) return <Page />;

  return (
    <Page>
      {walks.length === 0 ? (
        <Empty icon={I.log} title="아직 저장한 산책이 없어요" body="산책을 마치고 기록을 저장하면 여기에 쌓여요." />
      ) : (
        <Group>
          {walks.map((w) => (
            <Row
              key={w.id}
              left={<PhotoTile icon={w.photos.length ? I.photo : I.walk} label={w.cover ?? w.photos[0]} style={s.thumb} />}
              title={
                <View style={{ gap: 2 }}>
                  <Num size={16}>{dotDate(w.date)}</Num>
                  <T v="bodySmall" muted numberOfLines={1}>
                    {w.title}
                  </T>
                </View>
              }
              detail={
                <View style={s.detail}>
                  <Num size={16} bold>
                    {floorKm(w.distanceKm)}km
                  </Num>
                  <Num size={13} color={c.textSecondary}>
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
  thumb: { width: 52, height: 52, borderRadius: radius.thumb, padding: 0 },
  detail: { alignItems: "flex-end", gap: 2 },
});
