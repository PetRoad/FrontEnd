import { Stack } from "expo-router";
import { OnboardingHeader } from "@/components/common/OnboardingHeader";
import { useStackOptions } from "@/hooks/useTheme";
import { useUserStore } from "@/stores/userStore";

export default function AuthLayout() {
  const signedIn = useUserStore((s) => s.accessToken !== null);
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      {/* 온보딩 중 세션이 끊기면(재발급 실패) 저장할 수 없으니 로그인으로 돌려보낸다 */}
      <Stack.Protected guard={signedIn} redirectTo="/login">
        {/* 로그인에서 들어올 때 0.15초 뒤 진행바를 채운다 */}
        <Stack.Screen
          name="region"
          options={{ title: "", header: () => <OnboardingHeader step={1} total={2} fallbackHref="/login" delay={150} /> }}
        />
        {/* 1단계에서 넘어올 땐 헤더가 같은 자리에 있으니 전환 효과 없이 내용만 바꾼다 */}
        <Stack.Screen
          name="dog-register"
          options={{ title: "", animation: "none", header: () => <OnboardingHeader step={2} total={2} fallbackHref="/region" /> }}
        />
      </Stack.Protected>
    </Stack>
  );
}
