import { Pressable, StyleSheet, View } from "react-native";
import { I, Icon, PhotoTile, T } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";

type Props = { photos: string[]; selected?: string; onPress?: (photo: string) => void };

export function PhotoGrid({ photos, selected, onPress }: Props) {
  const c = useTheme();
  if (!photos.length) {
    return (
      <T v="subhead" muted>
        산책 중에 찍은 사진이 없어요.
      </T>
    );
  }
  return (
    <View style={s.grid}>
      {photos.map((p) => {
        const on = selected === p;
        return (
          <Pressable
            key={p}
            disabled={!onPress}
            accessibilityRole={onPress ? "button" : "image"}
            accessibilityLabel={p}
            accessibilityState={{ selected: on }}
            onPress={() => onPress?.(p)}
            style={s.cell}
          >
            <PhotoTile label={p} selected={on} style={s.square} />
            {on && (
              <View style={[s.badge, { backgroundColor: c.surface }]}>
                <Icon name={I.check} size={22} color={c.tint} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cell: { width: "31.8%" },
  square: { aspectRatio: 1 },
  badge: { position: "absolute", top: 6, right: 6, borderRadius: 12 },
});
