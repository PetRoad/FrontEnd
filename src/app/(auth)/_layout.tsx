import { Stack } from "expo-router";
import { OnboardingHeader } from "@/components/common/OnboardingHeader";
import { useStackOptions } from "@/hooks/useTheme";

export default function AuthLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      {/* 로그인에서 밀려 들어오는 전환(약 350ms)이 끝난 뒤 진행바를 채운다 */}
      <Stack.Screen
        name="region"
        options={{ title: "", header: () => <OnboardingHeader step={1} total={2} fallbackHref="/login" delay={350} /> }}
      />
      {/* 1단계에서 넘어올 땐 헤더가 같은 자리에 있으니 전환 효과 없이 내용만 바꾼다 */}
      <Stack.Screen
        name="dog-register"
        options={{ title: "", animation: "none", header: () => <OnboardingHeader step={2} total={2} fallbackHref="/region" /> }}
      />
    </Stack>
  );
}
