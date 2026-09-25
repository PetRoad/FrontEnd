import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, Field, Num, Plate, T } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";

// ponytail: 인증 없이 화면 흐름만. services/auth 연결 시 교체
export default function LoginScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.ground }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <View style={[s.hero, { backgroundColor: c.track, paddingTop: insets.top + 64 }]}>
        {/* 노면 문자처럼 세로로 늘인 워드마크 */}
        <Num size={64} bold color={c.onTrack} style={s.wordmark}>
          PETROAD
        </Num>
        <T v="title2" color={c.onTrack}>
          펫로드
        </T>
        <T v="subhead" color={c.onTrackMuted}>
          반려견과 걸은 길과 순간을 기록하고{"\n"}우리 동네의 좋은 산책길을 발견해요
        </T>
        <View style={s.centerLine}>
          {Array.from({ length: 6 }, (_, i) => (
            <View key={i} style={[s.centerDash, { backgroundColor: c.paint }]} />
          ))}
        </View>
      </View>

      <View style={s.form}>
        <Field label="이메일" placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="비밀번호" placeholder="비밀번호" secureTextEntry autoComplete="password" />
        <Plate title="로그인" onPress={() => router.push("/region")} style={{ marginTop: 8 }} />
        <Btn tone="plain" title="처음이신가요? 회원가입" onPress={() => router.push("/signup")} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 28, gap: 6 },
  wordmark: { transform: [{ scaleY: 1.22 }], marginBottom: 10, letterSpacing: 1 },
  centerLine: { flexDirection: "row", justifyContent: "space-between", marginTop: 28 },
  centerDash: { width: 30, height: 5, borderRadius: 2.5 },
  form: { padding: 24, gap: 16 },
});
