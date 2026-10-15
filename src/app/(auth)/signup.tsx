import { View } from "react-native";
import { router } from "expo-router";
import { BigField, Page, PasswordField, Plate, T } from "@/components/common/ui";
import { space } from "@/constants/theme";

export default function SignupScreen() {
  return (
    <Page contentStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
      <View style={{ gap: space.xxxl }}>
        <View style={{ gap: space.sm }}>
          <T v="titleLG">계정을 만들어요</T>
          <T muted>가입하면 동네와 반려견만 알려주시면 돼요.</T>
        </View>
        <View style={{ gap: space.md }}>
          <BigField placeholder="이메일" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <PasswordField placeholder="비밀번호 (8자 이상)" autoComplete="new-password" />
          <PasswordField placeholder="비밀번호 확인" autoComplete="new-password" />
        </View>
      </View>
      <Plate title="가입하고 시작하기" onPress={() => router.push("/region")} />
    </Page>
  );
}
