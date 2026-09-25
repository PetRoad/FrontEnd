import { Children, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ColorValue,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export const NUM_FONT = "BarlowCondensed_600SemiBold";
export const NUM_FONT_BOLD = "BarlowCondensed_700Bold";

export const shadow = { boxShadow: "0 2px 10px rgba(0, 0, 0, 0.10)" };

type IconName = SymbolViewProps["name"];

export const I = {
  walk: { ios: "figure.walk", android: "directions_walk" },
  person: { ios: "person.crop.circle", android: "account_circle" },
  locate: { ios: "location.fill", android: "my_location" },
  camera: { ios: "camera.fill", android: "photo_camera" },
  stop: { ios: "stop.fill", android: "stop" },
  heart: { ios: "heart", android: "favorite" },
  heartFill: { ios: "heart.fill", android: "favorite" },
  chevron: { ios: "chevron.right", android: "chevron_right" },
  photo: { ios: "photo", android: "image" },
  addPhoto: { ios: "camera", android: "add_a_photo" },
  check: { ios: "checkmark.circle.fill", android: "check_circle" },
  log: { ios: "book.closed", android: "menu_book" },
  album: { ios: "photo.on.rectangle", android: "photo_library" },
  map: { ios: "map", android: "map" },
  pin: { ios: "mappin", android: "location_on" },
} satisfies Record<string, IconName>;

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: ColorValue }) {
  const c = useTheme();
  // 웹은 안드로이드와 같은 Material Symbols 이름을 쓴다
  const n = typeof name === "string" ? name : { ...name, web: name.web ?? name.android };
  return <SymbolView name={n} size={size} tintColor={color ?? c.ink} />;
}

/* 글자: iOS 텍스트 스타일 단계 */
const TYPE = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: "700" },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: "600" },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 22 },
  subhead: { fontSize: 15, lineHeight: 20 },
  footnote: { fontSize: 13, lineHeight: 18 },
  caption: { fontSize: 12, lineHeight: 16 },
} satisfies Record<string, TextStyle>;

type TProps = {
  v?: keyof typeof TYPE;
  muted?: boolean;
  color?: string;
  center?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
};

export function T({ v = "body", muted, color, center, numberOfLines, style, children }: TProps) {
  const c = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[TYPE[v], { color: color ?? (muted ? c.inkMuted : c.ink) }, center && { textAlign: "center" }, style]}
    >
      {children}
    </Text>
  );
}

// 수치는 도로 표지 계열 콘덴스드 + 고정폭 숫자: 걷는 중에도 자리가 흔들리지 않는다
export function Num({ size = 17, bold, color, style, children }: { size?: number; bold?: boolean; color?: string; style?: StyleProp<TextStyle>; children: ReactNode }) {
  const c = useTheme();
  return (
    <Text
      style={[
        {
          fontFamily: bold ? NUM_FONT_BOLD : NUM_FONT,
          fontSize: size,
          lineHeight: Math.round(size * 1.08),
          color: color ?? c.ink,
          fontVariant: ["tabular-nums"],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// 숫자 아래에는 항상 라벨
export function Stat({ value, unit, label, size = 34, onTrack }: { value: string; unit?: string; label: string; size?: number; onTrack?: boolean }) {
  const c = useTheme();
  const fg = onTrack ? c.onTrack : c.ink;
  const sub = onTrack ? c.onTrackMuted : c.inkMuted;
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
        <Num size={size} bold color={fg}>
          {value}
        </Num>
        {unit && (
          <Num size={Math.round(size * 0.42)} color={sub}>
            {unit}
          </Num>
        )}
      </View>
      <T v="footnote" color={sub}>
        {label}
      </T>
    </View>
  );
}

type PressProps = { title: string; onPress?: () => void; icon?: IconName; disabled?: boolean; style?: StyleProp<ViewStyle> };

// 노면 노랑 판: 한 화면에 하나, 그 화면의 주 행동만
export function Plate({ title, onPress, icon, disabled, style }: PressProps) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.plate, { backgroundColor: c.paint, opacity: disabled ? 0.4 : pressed ? 0.82 : 1 }, style]}
    >
      {icon && <Icon name={icon} size={20} color={c.onPaint} />}
      <Text style={[TYPE.headline, { color: c.onPaint }]}>{title}</Text>
    </Pressable>
  );
}

type Tone = "surface" | "track" | "onTrack" | "plain";

export function Btn({ title, onPress, icon, disabled, style, tone = "surface" }: PressProps & { tone?: Tone }) {
  const c = useTheme();
  const look = {
    surface: { bg: c.surface, fg: c.ink, line: c.hairline },
    track: { bg: c.track, fg: c.onTrack, line: c.track },
    onTrack: { bg: "rgba(255, 255, 255, 0.14)", fg: c.onTrack, line: "rgba(255, 255, 255, 0.3)" },
    plain: { bg: "transparent", fg: c.tint, line: "transparent" },
  }[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: look.bg, borderColor: look.line, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={18} color={look.fg} />}
      <Text style={[TYPE.headline, { color: look.fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label?: string }) {
  const c = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {label && (
        <T v="footnote" muted>
          {label}
        </T>
      )}
      <TextInput
        placeholderTextColor={c.inkMuted}
        selectionColor={c.tint}
        cursorColor={c.tint}
        {...props}
        style={[TYPE.body, s.field, { backgroundColor: c.surface, borderColor: c.hairline, color: c.ink }, style]}
      />
    </View>
  );
}

export function Segmented<V extends string>({ options, value, onChange }: { options: readonly V[]; value: V; onChange: (v: V) => void }) {
  const c = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={[s.segment, { backgroundColor: c.fill }]}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o)}
            style={[s.segmentItem, on && [{ backgroundColor: c.raised }, shadow]]}
          >
            <Text style={[TYPE.subhead, { color: c.ink, fontWeight: on ? "600" : "400" }]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  const c = useTheme();
  return (
    <Pressable
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityState={{ selected: !!on }}
      onPress={onPress}
      hitSlop={4}
      style={[s.chip, on ? { backgroundColor: c.track, borderColor: c.track } : { backgroundColor: c.surface, borderColor: c.hairline }]}
    >
      <Text style={[TYPE.subhead, { color: on ? c.onTrack : c.ink, fontWeight: on ? "600" : "400" }]}>{label}</Text>
    </Pressable>
  );
}

// 사진 자리. expo-camera 연결 전까지 사진 대신 쓰인다
export function PhotoTile({ label, icon = I.photo, selected, style }: { label?: string; icon?: IconName; selected?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <View style={[s.tile, { backgroundColor: c.tile }, selected && { borderWidth: 3, borderColor: c.tint }, style]}>
      <Icon name={icon} size={22} color={c.inkMuted} />
      {label ? (
        <T v="caption" muted numberOfLines={1}>
          {label}
        </T>
      ) : null}
    </View>
  );
}

// 지도 자리. react-native-maps 연결 전까지 동네 블록과 천(川) 띠로 지도 톤만 낸다
const ROADS_V = ["16%", "49%", "82%"] as const;
const ROADS_H = ["24%", "61%", "88%"] as const;

export function MapPlate({ style, marker, children }: { style?: StyleProp<ViewStyle>; marker?: boolean; children?: ReactNode }) {
  const c = useTheme();
  return (
    <View style={[{ backgroundColor: c.mapTone, overflow: "hidden" }, style]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[s.stream, { backgroundColor: c.stream }]} />
        {ROADS_V.map((left) => (
          <View key={left} style={[s.roadV, { left, backgroundColor: c.mapRoad }]} />
        ))}
        {ROADS_H.map((top) => (
          <View key={top} style={[s.roadH, { top, backgroundColor: c.mapRoad }]} />
        ))}
      </View>
      {/* 위쪽은 화면마다 떠 있는 버튼이 덮으므로, 안내 문구는 마커 바로 아래에 둔다 */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, s.center]}>
        {marker && <MeMarker />}
        <T v="caption" muted>
          지도 연결 예정
        </T>
      </View>
      {children}
    </View>
  );
}

export function MeMarker() {
  const c = useTheme();
  return (
    // 다크 지도에서도 보이도록 틴트(라이트 트랙 초록 / 다크 밝은 초록)로 칠한다
    <View accessibilityLabel="내 위치" style={s.halo}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: 24, backgroundColor: c.tint, opacity: 0.2 }]} />
      <View style={[s.dot, { backgroundColor: c.tint, borderColor: c.onTrack }, shadow]} />
    </View>
  );
}

// 노면 점선. filled 칸은 노면 노랑으로 칠해진다
export function Lane({ total, filled = 0, on, off, height = 6 }: { total: number; filled?: number; on: string; off: string; height?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ flex: 1, height, borderRadius: height / 2, backgroundColor: off, overflow: "hidden" }}>
          {i < filled && <Animated.View entering={FadeIn.duration(450)} style={[StyleSheet.absoluteFill, { backgroundColor: on }]} />}
        </View>
      ))}
    </View>
  );
}

// 온보딩 단계: 트랙 초록으로 칠해진 점선
export function Steps({ step, total }: { step: number; total: number }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }} accessibilityLabel={`${total}단계 중 ${step}단계`}>
      <View style={{ width: 28 * total }}>
        <Lane total={total} filled={step} on={c.track} off={c.hairline} height={5} />
      </View>
      <Num size={15} color={c.inkMuted}>
        {step}/{total}
      </Num>
    </View>
  );
}

export function Page({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.ground }}
      contentContainerStyle={[s.page, contentStyle]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <T v="headline">{title}</T>
        {hint && (
          <T v="footnote" muted>
            {hint}
          </T>
        )}
      </View>
      {children}
    </View>
  );
}

// iOS 인셋 그룹 목록
export function Group({ header, children }: { header?: string; children: ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {header && (
        <T v="footnote" muted style={{ paddingHorizontal: 16 }}>
          {header}
        </T>
      )}
      <View style={[s.group, { backgroundColor: c.surface }]}>
        {Children.toArray(children).map((child, i) => (
          <View key={i}>
            {i > 0 && <View style={[s.sep, { backgroundColor: c.hairline }]} />}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

type RowProps = { title: ReactNode; sub?: string; icon?: IconName; left?: ReactNode; detail?: ReactNode; onPress?: () => void };

export function Row({ title, sub, icon, left, detail, onPress }: RowProps) {
  const c = useTheme();
  return (
    <Pressable
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && { backgroundColor: c.fill }]}
    >
      {left ?? (icon && <Icon name={icon} size={20} color={c.tint} />)}
      <View style={{ flex: 1, gap: 2 }}>
        {typeof title === "string" ? <T numberOfLines={1}>{title}</T> : title}
        {sub && (
          <T v="subhead" muted numberOfLines={1}>
            {sub}
          </T>
        )}
      </View>
      {typeof detail === "string" || typeof detail === "number" ? (
        <Num size={20} color={c.inkMuted}>
          {detail}
        </Num>
      ) : (
        detail
      )}
      {onPress && <Icon name={I.chevron} size={14} color={c.inkMuted} />}
    </Pressable>
  );
}

// 화면 하단 고정 행동 영역: 주 행동을 엄지 높이에 둔다
export function BottomBar({ children }: { children: ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingBottom: insets.bottom + 12, backgroundColor: c.ground, borderTopColor: c.hairline }]}>{children}</View>
  );
}

export function Empty({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  const c = useTheme();
  return (
    <View style={s.empty}>
      <Icon name={icon} size={40} color={c.inkMuted} />
      <T v="headline" center>
        {title}
      </T>
      <T v="subhead" muted center>
        {body}
      </T>
    </View>
  );
}

const s = StyleSheet.create({
  plate: { height: 56, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 20 },
  btn: { minHeight: 50, borderRadius: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 16 },
  field: { minHeight: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  segment: { flexDirection: "row", borderRadius: 10, padding: 2, height: 40 },
  segmentItem: { flex: 1, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  tile: { borderRadius: 10, alignItems: "center", justifyContent: "center", gap: 4, overflow: "hidden", padding: 6 },
  stream: { position: "absolute", left: "-20%", right: "-20%", top: "38%", height: 46, transform: [{ rotate: "-14deg" }] },
  roadV: { position: "absolute", top: 0, bottom: 0, width: 9 },
  roadH: { position: "absolute", left: 0, right: 0, height: 9 },
  center: { alignItems: "center", justifyContent: "center", gap: 2 },
  halo: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 3 },
  page: { padding: 16, gap: 24, paddingBottom: 48 },
  group: { borderRadius: 12, overflow: "hidden" },
  sep: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  row: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  empty: { alignItems: "center", gap: 8, paddingVertical: 56, paddingHorizontal: 24 },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0, gap: 10, paddingTop: 12, paddingHorizontal: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
