import { Children, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
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
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font, glass, gutter, radius, shadow, space, typography, type Weight } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type IconName = SymbolViewProps["name"];

// 아웃라인이 기본. 채운 모양은 상태(좋아요 켜짐, 선택됨)와 정지 기호에만
export const I = {
  walk: { ios: "figure.walk", android: "directions_walk" },
  person: { ios: "person.crop.circle", android: "account_circle" },
  locate: { ios: "location", android: "my_location" },
  camera: { ios: "camera", android: "photo_camera" },
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
  paw: { ios: "pawprint", android: "pets" },
  eye: { ios: "eye", android: "visibility" },
  eyeSlash: { ios: "eye.slash", android: "visibility_off" },
  search: { ios: "magnifyingglass", android: "search" },
  close: { ios: "xmark", android: "close" },
} satisfies Record<string, IconName>;

export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: ColorValue }) {
  const c = useTheme();
  // 웹은 안드로이드와 같은 Material Symbols 이름을 쓴다
  const n = typeof name === "string" ? name : { ...name, web: name.web ?? name.android };
  return <SymbolView name={n} size={size} tintColor={color ?? c.textPrimary} />;
}

// 서비스 로고(발바닥 + 발자국). 투명 PNG라 tintColor로 색을 바꾼다
export function Logo({ size = 24, color }: { size?: number; color?: ColorValue }) {
  const c = useTheme();
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      tintColor={String(color ?? c.textPrimary)}
      contentFit="contain"
      accessibilityLabel="펫로드 로고"
      style={{ width: size, height: Math.round((size * 567) / 624) }}
    />
  );
}

type TProps = {
  v?: keyof typeof typography;
  w?: Weight; // 단계 기본 굵기를 바꿀 때만 (예: Caption Medium)
  muted?: boolean;
  color?: string;
  center?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
};

export function T({ v = "body", w, muted, color, center, numberOfLines, style, children }: TProps) {
  const c = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        typography[v],
        w && { fontFamily: font[w] },
        { color: color ?? (muted ? c.textSecondary : c.textPrimary) },
        center && { textAlign: "center" },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// 수치는 고정폭 숫자: 걷는 중 값이 바뀌어도 자리가 흔들리지 않는다
export function Num({ size = 16, bold, color, style, children }: { size?: number; bold?: boolean; color?: string; style?: StyleProp<TextStyle>; children: ReactNode }) {
  const c = useTheme();
  return (
    <Text
      style={[
        {
          fontFamily: bold ? font.bold : font.semibold,
          fontSize: size,
          lineHeight: Math.round(size * 1.25),
          letterSpacing: size >= 28 ? size * -0.02 : 0,
          color: color ?? c.textPrimary,
          fontVariant: ["tabular-nums"],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// 숫자 아래에는 항상 라벨. 색 면 위에서는 sub로 단위·라벨 색을 바꾼다(회색은 대비가 모자람)
export function Stat({ value, unit, label, size = 32, sub }: { value: string; unit?: string; label: string; size?: number; sub?: string }) {
  const c = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
        <Num size={size} bold>
          {value}
        </Num>
        {unit && (
          <Num size={Math.max(12, Math.round(size * 0.45))} color={sub ?? c.textSecondary}>
            {unit}
          </Num>
        )}
      </View>
      <T v="bodySmall" color={sub} muted>
        {label}
      </T>
    </View>
  );
}

type PressProps = {
  title: string;
  onPress?: () => void;
  icon?: IconName | ReactElement;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};
type Tone = "primary" | "secondary" | "plain";

// primary: 화면당 하나뿐인 주 행동(Chew Yellow 채움) / secondary: 보조 행동(Cream Beige 틴트) / plain: 가장 약한 행동(버리기, 전환)
// 눌림은 투명도 대신 한 단계 진한 색. 비활성은 회색 면 + 흰 글자
export function Btn({ title, onPress, icon, disabled, loading, style, tone = "secondary" }: PressProps & { tone?: Tone }) {
  const c = useTheme();
  const look = {
    primary: { bg: c.primary, down: c.primaryPressed, fg: c.onPrimary, h: 56, text: typography.bodyMain },
    secondary: { bg: c.primarySoft, down: c.primarySoftPressed, fg: c.primaryDeep, h: 52, text: typography.bodyMain },
    plain: { bg: "transparent", down: c.surfaceMuted, fg: c.textSecondary, h: 44, text: [typography.body, { fontFamily: font.medium }] },
  }[tone];
  const off = disabled && tone !== "plain";
  const fg = off ? c.surface : disabled ? c.textTertiary : look.fg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [s.btn, { minHeight: look.h, backgroundColor: off ? c.borderStrong : pressed ? look.down : look.bg }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : isValidElement(icon) ? icon : icon && <Icon name={icon} size={20} color={fg} />}
      <Text style={[look.text, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

// Chew Yellow 주 버튼
export function Plate(props: PressProps) {
  return <Btn {...props} tone="primary" />;
}

export function Field({ label, error, style, onFocus, onBlur, ...props }: TextInputProps & { label?: string; error?: string }) {
  const c = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: space.sm }}>
      {label && (
        <T v="bodySmall" w="medium" muted>
          {label}
        </T>
      )}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.textSecondary}
        selectionColor={c.textPrimary}
        cursorColor={c.textPrimary}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        // 흰 칸 + 회색 테두리, 포커스는 Chew Brown. 수정할 수 없는 칸은 회색으로 채운다
        style={[
          s.field,
          {
            color: c.textPrimary,
            backgroundColor: props.editable === false ? c.surfaceMuted : c.surface,
            borderColor: error ? c.error : focused ? c.primaryDeep : c.borderStrong,
          },
          style,
        ]}
      />
      {error && (
        <T v="caption" color={c.error}>
          {error}
        </T>
      )}
    </View>
  );
}

// 로그인·회원가입의 큰 입력칸: 라벨 없이 플레이스홀더만
export function BigField({ style, ...props }: TextInputProps & { error?: string }) {
  return <Field {...props} style={[s.bigField, style]} />;
}

export function PasswordField(props: TextInputProps) {
  const c = useTheme();
  const [hidden, setHidden] = useState(true);
  return (
    <View>
      <BigField {...props} secureTextEntry={hidden} style={{ paddingRight: 52 }} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hidden ? "비밀번호 보기" : "비밀번호 숨기기"}
        onPress={() => setHidden(!hidden)}
        style={s.eye}
      >
        <Icon name={hidden ? I.eyeSlash : I.eye} size={20} color={c.textSecondary} />
      </Pressable>
    </View>
  );
}

// subs: 항목 이름 아래 작은 설명(예: 크기별 무게)
export function Segmented<V extends string>({
  options,
  value,
  onChange,
  subs,
}: {
  options: readonly V[];
  value: V;
  onChange: (v: V) => void;
  subs?: Partial<Record<V, string>>;
}) {
  const c = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={[s.segment, { backgroundColor: c.surfaceMuted }, subs && { height: 60 }]}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            accessibilityRole="radio"
            accessibilityLabel={subs?.[o] ? `${o} ${subs[o]}` : undefined}
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o)}
            style={[s.segmentItem, on && [{ backgroundColor: c.surface }, shadow.subtle]]}
          >
            <T v="bodySmall" w={on ? "semibold" : "medium"} muted={!on}>
              {o}
            </T>
            {subs?.[o] && (
              <Num size={12} color={c.textSecondary} style={{ fontFamily: font.regular }}>
                {subs[o]}
              </Num>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// 고를 수 있는 칩. 선택되면 Chew Yellow
export function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!on }}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [s.chip, { backgroundColor: on ? (pressed ? c.primaryPressed : c.primary) : pressed ? c.borderSubtle : c.surfaceMuted }]}
    >
      <T v="bodySmall" w={on ? "semibold" : "medium"} color={on ? c.onPrimary : c.textPrimary}>
        {label}
      </T>
    </Pressable>
  );
}

// 읽기 전용 태그. 중요한 태그(난이도)만 soft = Cream Beige
export function Tag({ label, soft }: { label: string; soft?: boolean }) {
  const c = useTheme();
  return (
    <View style={[s.tag, { backgroundColor: soft ? c.primarySoft : c.surfaceMuted }]}>
      <T v="caption" w="medium">
        {label}
      </T>
    </View>
  );
}

// 사진 자리. expo-camera 연결 전까지 사진 대신 쓰인다
export function PhotoTile({ label, icon = I.photo, selected, style }: { label?: string; icon?: IconName; selected?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <View style={[s.tile, { backgroundColor: c.surfaceMuted }, selected && { borderWidth: 3, borderColor: c.primary }, style]}>
      <Icon name={icon} size={22} color={c.textTertiary} />
      {label ? (
        <T v="caption" muted numberOfLines={1}>
          {label}
        </T>
      ) : null}
    </View>
  );
}

// 온보딩 단계: 단계마다 한 칸씩 Chew Yellow로 채워지는 가로 바 + "n/N"
export function Steps({ step, total }: { step: number; total: number }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }} accessibilityLabel={`${total}단계 중 ${step}단계`}>
      <View style={{ flex: 1, flexDirection: "row", gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          // 바 전체의 양 끝만 둥글게, 칸 사이 갈라진 쪽은 각지게
          <View
            key={i}
            style={[
              s.track,
              { backgroundColor: i < step ? c.primary : c.borderSubtle },
              i === 0 && { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 },
              i === total - 1 && { borderTopRightRadius: 3, borderBottomRightRadius: 3 },
            ]}
          />
        ))}
      </View>
      <Num size={14} color={c.textSecondary}>
        {step}/{total}
      </Num>
    </View>
  );
}

// 지도 위 오버레이 전용 유리 면. iOS만 실제 블러, 나머지는 더 불투명한 흰 면으로 대신한다
export function Glass({ r = radius.card, style, children, ...rest }: ViewProps & { r?: number }) {
  const blur = Platform.OS === "ios";
  return (
    <View
      {...rest}
      style={[{ borderRadius: r, borderWidth: 1, borderColor: glass.border, backgroundColor: blur ? glass.bg : glass.bgSolid }, shadow.float, style]}
    >
      {blur && <BlurView intensity={glass.blur} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: r, overflow: "hidden" }]} />}
      {children}
    </View>
  );
}

// 지도 위 원형 버튼. 블러가 깨지지 않도록 눌림은 투명도 대신 크기로 보여준다
export function FloatButton({ icon, label, onPress, size = 48, badge }: { icon: IconName; label: string; onPress: () => void; size?: number; badge?: number }) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.94 : 1 }] })}
    >
      <Glass r={size / 2} style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={Math.round(size * 0.42)} />
      </Glass>
      {!!badge && (
        <View style={[s.badge, { backgroundColor: c.primary, borderColor: c.surface }]}>
          <Num size={12} bold color={c.onPrimary}>
            {badge}
          </Num>
        </View>
      )}
    </Pressable>
  );
}

export function Page({ children, contentStyle }: { children: ReactNode; contentStyle?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
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
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <T v="bodyMain">{title}</T>
        {hint && (
          <T v="bodySmall" muted>
            {hint}
          </T>
        )}
      </View>
      {children}
    </View>
  );
}

// 묶음 목록: 흰 면 + 실선, 그림자 없음
export function Group({ header, children }: { header?: string; children: ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      {header && (
        <T v="bodySmall" w="medium" muted style={{ paddingHorizontal: space.xs }}>
          {header}
        </T>
      )}
      <View style={[s.group, { backgroundColor: c.surface, borderColor: c.borderSubtle }]}>
        {Children.toArray(children).map((child, i) => (
          <View key={i}>
            {i > 0 && <View style={[s.sep, { backgroundColor: c.borderSubtle }]} />}
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
      style={({ pressed }) => [s.row, pressed && { backgroundColor: c.surfaceMuted }]}
    >
      {left ?? (icon && <Icon name={icon} size={20} />)}
      <View style={{ flex: 1, gap: 2 }}>
        {typeof title === "string" ? <T numberOfLines={1}>{title}</T> : title}
        {sub && (
          <T v="bodySmall" muted numberOfLines={1}>
            {sub}
          </T>
        )}
      </View>
      {typeof detail === "string" || typeof detail === "number" ? (
        <Num size={16} color={c.textSecondary}>
          {detail}
        </Num>
      ) : (
        detail
      )}
      {onPress && <Icon name={I.chevron} size={14} color={c.textTertiary} />}
    </Pressable>
  );
}

// 화면 하단 고정 행동 영역: 주 행동을 엄지 높이에 둔다
export function BottomBar({ children }: { children: ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingBottom: insets.bottom + space.md, backgroundColor: c.background, borderTopColor: c.borderSubtle }]}>
      {children}
    </View>
  );
}

export function Empty({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  const c = useTheme();
  return (
    <View style={s.empty}>
      <Icon name={icon} size={40} color={c.textTertiary} />
      <T v="bodyMain" center>
        {title}
      </T>
      <T v="bodySmall" muted center>
        {body}
      </T>
    </View>
  );
}

const s = StyleSheet.create({
  btn: { borderRadius: radius.button, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space.sm, paddingHorizontal: space.xl },
  // 한 줄 입력칸에 lineHeight를 주면 iOS에서 글자가 위아래로 밀려 크기·자간만 준다
  field: { minHeight: 52, borderRadius: radius.input, borderWidth: 1, paddingHorizontal: space.lg, paddingVertical: space.md, fontFamily: font.regular, fontSize: 16, letterSpacing: -0.2 },
  bigField: { minHeight: 56 },
  eye: { position: "absolute", right: 4, top: 6, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  segment: { flexDirection: "row", borderRadius: radius.input, padding: 3, height: 44 },
  segmentItem: { flex: 1, borderRadius: radius.input - 3, alignItems: "center", justifyContent: "center" },
  chip: { height: 40, paddingHorizontal: 14, borderRadius: radius.chip, alignItems: "center", justifyContent: "center" },
  tag: { height: 24, paddingHorizontal: space.sm, borderRadius: radius.chip, justifyContent: "center" },
  tile: { borderRadius: radius.thumb, alignItems: "center", justifyContent: "center", gap: space.xs, overflow: "hidden", padding: 6 },
  track: { flex: 1, height: 6 },
  badge: { position: "absolute", top: -4, right: -4, minWidth: 22, height: 22, paddingHorizontal: 5, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  page: { padding: gutter, gap: space.xxl, paddingBottom: space.huge },
  group: { borderRadius: radius.card, overflow: "hidden", borderWidth: 1 },
  sep: { height: StyleSheet.hairlineWidth, marginLeft: space.lg },
  row: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md },
  empty: { alignItems: "center", gap: space.sm, paddingVertical: 56, paddingHorizontal: space.xxl },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0, gap: space.md, paddingTop: space.md, paddingHorizontal: gutter, borderTopWidth: StyleSheet.hairlineWidth },
});
