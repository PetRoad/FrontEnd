import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BigField, Logo, PasswordField, Plate, T } from "@/components/common/ui";
import { gutter, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

// ponytail: 인증 없이 화면 흐름만. services/auth 연결 시 교체
export default function LoginScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={[s.page, { paddingTop: insets.top + 72, paddingBottom: insets.bottom + space.xxl }]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <View style={s.form}>
        <View style={s.brand}>
          <View style={{ marginBottom: space.md }}>
            <Logo size={64} />
          </View>
          <T v="titleXL">PetRoad</T>
          <T muted>반려견과 걷는 우리 동네 산책길</T>
        </View>
        <BigField placeholder="이메일" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <PasswordField placeholder="비밀번호" autoComplete="password" />
      </View>

      <View style={s.actions}>
        <Plate title="로그인" onPress={() => router.push("/region")} />
        <Pressable accessibilityRole="link" onPress={() => router.push("/signup")} style={s.link}>
          <T v="bodySmall" w="semibold" muted>
            회원가입
          </T>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "space-between", paddingHorizontal: gutter, gap: 48 },
  brand: { alignItems: "center", gap: space.xs, marginBottom: space.xxxl },
  form: { gap: space.md },
  actions: { gap: space.sm },
  link: { minHeight: 44, alignItems: "center", justifyContent: "center" },
});
