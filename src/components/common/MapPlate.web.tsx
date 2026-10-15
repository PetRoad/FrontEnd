import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { T } from "@/components/common/ui";
import { shadow } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

// 웹 전용 지도 자리. react-native-maps는 웹을 지원하지 않아 동네 블록과 물길로 지도 톤만 낸다
const ROADS_V = ["16%", "49%", "82%"] as const;
const ROADS_H = ["24%", "61%", "88%"] as const;

export function MapPlate({ style, marker }: { style?: StyleProp<ViewStyle>; marker?: boolean; [rest: string]: unknown }) {
  const c = useTheme();
  return (
    <View style={[{ backgroundColor: c.surfaceMuted, overflow: "hidden" }, style]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[s.stream, { backgroundColor: c.mapWater }]} />
        {ROADS_V.map((left) => (
          <View key={left} style={[s.roadV, { left, backgroundColor: c.surface }]} />
        ))}
        {ROADS_H.map((top) => (
          <View key={top} style={[s.roadH, { top, backgroundColor: c.surface }]} />
        ))}
      </View>
      {/* 위쪽은 화면마다 떠 있는 버튼이 덮으므로, 안내 문구는 마커 바로 아래에 둔다 */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, s.center]}>
        {marker && (
          <View accessibilityLabel="내 위치" style={s.halo}>
            <View style={[StyleSheet.absoluteFill, { borderRadius: 24, backgroundColor: c.primary, opacity: 0.35 }]} />
            <View style={[s.dot, { backgroundColor: c.primary, borderColor: c.surface }, shadow.subtle]} />
          </View>
        )}
        <T v="caption" muted>
          지도는 앱에서 볼 수 있어요
        </T>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  stream: { position: "absolute", left: "-20%", right: "-20%", top: "38%", height: 46, transform: [{ rotate: "-14deg" }] },
  roadV: { position: "absolute", top: 0, bottom: 0, width: 9 },
  roadH: { position: "absolute", left: 0, right: 0, height: 9 },
  center: { alignItems: "center", justifyContent: "center", gap: 2 },
  halo: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 3 },
});
