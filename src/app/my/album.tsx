import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Btn, Empty, I, Num, Page, PhotoTile, T } from "@/components/common/ui";
import { grid } from "@/components/walk/PhotoGrid";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import type { Walk } from "@/types/walk";
import { dotDate, km, minutes, monthLabel } from "@/utils/format";

type Item = { walk: Walk; photo: string };

export default function AlbumScreen() {
  const c = useTheme();
  const walks = useWalkStore((s) => s.walks);
  const [sel, setSel] = useState<Item>();

  const months = new Map<string, Item[]>();
  for (const walk of walks) {
    for (const photo of walk.photos) {
      const m = monthLabel(walk.date);
      months.set(m, [...(months.get(m) ?? []), { walk, photo }]);
    }
  }
  const isSel = (it: Item) => sel?.walk.id === it.walk.id && sel.photo === it.photo;

  if (months.size === 0) {
    return (
      <Page>
        <Empty icon={I.album} title="아직 사진이 없어요" body="산책 중에 사진을 찍으면 날짜별로 모여요." />
      </Page>
    );
  }

  return (
    <Page>
      {sel && (
        <View style={[s.panel, { backgroundColor: c.surface, borderColor: c.borderSubtle }]}>
          <PhotoTile label={sel.photo} style={s.big} />
          <View style={s.info}>
            <Num size={20} bold>
              {dotDate(sel.walk.date)}
            </Num>
            <T w="semibold">{sel.walk.title}</T>
            <T v="bodySmall" muted>
              {km(sel.walk.distanceKm)} · {minutes(sel.walk.durationSec)}
            </T>
            <Btn
              title="산책일지 보기"
              onPress={() => router.push({ pathname: "/my/walk/[id]", params: { id: sel.walk.id } })}
              style={{ marginTop: space.md }}
            />
          </View>
        </View>
      )}
      {[...months].map(([month, items]) => (
        <View key={month} style={{ gap: space.md }}>
          <T v="bodyMain">{month}</T>
          <View style={grid.wrap}>
            {items.map((it) => (
              <Pressable
                key={it.walk.id + it.photo}
                accessibilityRole="button"
                accessibilityLabel={`${dotDate(it.walk.date)} ${it.walk.title} ${it.photo}`}
                accessibilityState={{ selected: isSel(it) }}
                onPress={() => setSel(it)}
                style={grid.cell}
              >
                <PhotoTile label={it.photo} selected={isSel(it)} style={grid.square} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Page>
  );
}

const s = StyleSheet.create({
  panel: { borderRadius: radius.card, borderWidth: 1, padding: space.xs },
  big: { height: 240, borderRadius: radius.image },
  info: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.md, gap: space.xs },
});
