import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, Dots, Field, Num, Plate, T } from "@/components/common/ui";
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
      <View style={[s.hero, { backgroundColor: c.accentSoft, paddingTop: insets.top + 72 }]}>
        <Num size={44} bold>
          PetRoad
        </Num>
        <T v="title2">펫로드</T>
        <T v="subhead" muted>
          반려견과 걸은 길과 순간을 기록하고{"\n"}우리 동네의 좋은 산책길을 발견해요
        </T>
        <View style={s.steps}>
          <Dots total={7} filled={4} size={10} />
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
  hero: { paddingHorizontal: 24, paddingBottom: 32, gap: 6, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  steps: { width: 132, marginTop: 24 },
  form: { padding: 24, gap: 16 },
});
