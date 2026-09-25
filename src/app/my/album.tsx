import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Btn, Empty, I, Num, Page, PhotoTile, T, shadow } from "@/components/common/ui";
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
        <View style={[s.panel, { backgroundColor: c.surface }, shadow]}>
          <PhotoTile label={sel.photo} style={s.big} />
          <View style={{ padding: 16, gap: 4 }}>
            <Num size={22} bold>
              {dotDate(sel.walk.date)}
            </Num>
            <T v="headline">{sel.walk.title}</T>
            <T v="subhead" muted>
              {km(sel.walk.distanceKm)} · {minutes(sel.walk.durationSec)}
            </T>
            <Btn
              title="산책일지 보기"
              onPress={() => router.push({ pathname: "/my/walk/[id]", params: { id: sel.walk.id } })}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      )}
      {[...months].map(([month, items]) => (
        <View key={month} style={{ gap: 10 }}>
          <T v="title3">{month}</T>
          <View style={s.grid}>
            {items.map((it) => (
              <Pressable
                key={it.walk.id + it.photo}
                accessibilityRole="button"
                accessibilityLabel={`${dotDate(it.walk.date)} ${it.walk.title} ${it.photo}`}
                accessibilityState={{ selected: isSel(it) }}
                onPress={() => setSel(it)}
                style={s.cell}
              >
                <PhotoTile label={it.photo} selected={isSel(it)} style={s.square} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </Page>
  );
}

const s = StyleSheet.create({
  panel: { borderRadius: 16, overflow: "hidden" },
  big: { height: 240, borderRadius: 0 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  cell: { width: "32.2%" },
  square: { aspectRatio: 1, borderRadius: 6 },
});
