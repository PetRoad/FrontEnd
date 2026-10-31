import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BigField, Logo, PasswordField, Plate, T } from "@/components/common/ui";
import { gutter, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

// 인트로: 로고와 PetRoad가 화면 가운데 크게 머문 뒤 제자리로 줄어들며 들어가고, 나머지가 뒤따라 나타난다
const HOLD = 1300; // 가운데에 머무는 시간(나타나는 400ms 포함)
const SETTLE = 750;
const BIG = 1.3;
const arrive = Easing.bezier(0.16, 1, 0.3, 1);
// 앱 실행당 한 번. 로그아웃 후 돌아올 때는 기다리지 않는다
let introPlayed = false;

type Phase = "wait" | "play" | "done";

function Reveal({ phase, delay, rise, children }: { phase: Phase; delay: number; rise: boolean; children: ReactNode }) {
  const p = useSharedValue(phase === "done" ? 1 : 0);
  useEffect(() => {
    if (phase === "play") p.value = withDelay(delay, withTiming(1, { duration: 420, easing: arrive }));
  }, [phase, delay, p]);
  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: rise ? (1 - p.value) * 12 : 0 }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

// ponytail: 인증 없이 화면 흐름만. services/auth 연결 시 교체
export default function LoginScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(introPlayed ? "done" : "wait");
  const markRef = useRef<ComponentRef<typeof View>>(null);
  const shift = useSharedValue(0);
  const settle = useSharedValue(phase === "done" ? 1 : 0);
  const shown = useSharedValue(phase === "done" ? 1 : 0);

  const play = () => {
    if (introPlayed) return;
    introPlayed = true;
    // 제자리를 재고 그만큼 가운데로 옮겨 둔 채 시작한다
    markRef.current?.measureInWindow((_x, y, _w, h) => {
      const done = () => scheduleOnRN(setPhase, "done");
      if (reduceMotion) {
        // 동작 줄이기: 움직임 없이 제자리에서 페이드만
        settle.value = 1;
        shown.value = withTiming(1, { duration: 300 }, done);
      } else {
        shift.value = height / 2 - (y + h / 2);
        shown.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
        settle.value = withDelay(HOLD, withTiming(1, { duration: SETTLE, easing: arrive }, done));
      }
      setPhase("play");
    });
  };

  const markStyle = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: shift.value * (1 - settle.value) }, { scale: BIG + (1 - BIG) * settle.value }],
  }));

  // 로고가 줄어들기 시작하고 300ms 뒤부터 순서대로
  const at = (order: number) => (reduceMotion ? 200 + order * 60 : HOLD + 300 + order * 70);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={[
        s.page,
        { paddingTop: insets.top + 72, paddingBottom: insets.bottom + space.xxl },
        { pointerEvents: phase === "done" ? "auto" : "none" },
      ]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <View style={s.form}>
        <View style={s.brand}>
          <View ref={markRef} onLayout={play}>
            <Animated.View style={[s.mark, markStyle]}>
              <View style={{ marginBottom: space.md }}>
                <Logo size={64} />
              </View>
              <T v="titleXL">PetRoad</T>
            </Animated.View>
          </View>
          <Reveal phase={phase} delay={at(0)} rise={!reduceMotion}>
            <T muted>반려견과 걷는 우리 동네 산책길</T>
          </Reveal>
        </View>
        <Reveal phase={phase} delay={at(1)} rise={!reduceMotion}>
          <BigField placeholder="이메일" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        </Reveal>
        <Reveal phase={phase} delay={at(2)} rise={!reduceMotion}>
          <PasswordField placeholder="비밀번호" autoComplete="password" />
        </Reveal>
      </View>

      <Reveal phase={phase} delay={at(3)} rise={!reduceMotion}>
        <View style={s.actions}>
          <Plate title="로그인" onPress={() => router.push("/region")} />
          <Pressable accessibilityRole="link" onPress={() => router.push("/signup")} style={s.link}>
            <T v="bodySmall" w="semibold" muted>
              회원가입
            </T>
          </Pressable>
        </View>
      </Reveal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "space-between", paddingHorizontal: gutter, gap: 48 },
  brand: { alignItems: "center", gap: space.xs, marginBottom: space.xxxl },
  mark: { alignItems: "center", gap: space.xs },
  form: { gap: space.md },
  actions: { gap: space.sm },
  link: { minHeight: 44, alignItems: "center", justifyContent: "center" },
});
