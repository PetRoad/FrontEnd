import { Pressable, StyleSheet, View } from "react-native";
import { I, Icon, PhotoTile, T } from "@/components/common/ui";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = { photos: string[]; selected?: string; onPress?: (photo: string) => void };

// 3열 정사각 그리드. 칸마다 4씩 여백을 주고 바깥을 -4로 당겨, 화면 폭과 상관없이 간격 8로 딱 맞는다
export const grid = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", margin: -4 },
  cell: { width: "33.3333%", padding: 4 },
  square: { aspectRatio: 1, borderRadius: radius.thumb },
});

export function PhotoGrid({ photos, selected, onPress }: Props) {
  const c = useTheme();
  if (!photos.length) {
    return (
      <T v="bodySmall" muted>
        산책 중에 찍은 사진이 없어요.
      </T>
    );
  }
  return (
    <View style={grid.wrap}>
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
            style={grid.cell}
          >
            <PhotoTile label={p} selected={on} style={grid.square} />
            {on && (
              <View style={[s.badge, { backgroundColor: c.surface }]}>
                <Icon name={I.check} size={22} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  badge: { position: "absolute", top: 10, right: 10, borderRadius: 12 },
});
