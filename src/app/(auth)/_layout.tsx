import { Stack } from "expo-router";
import { OnboardingHeader } from "@/components/common/OnboardingHeader";
import { useStackOptions } from "@/hooks/useTheme";

export default function AuthLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      <Stack.Screen name="region" options={{ title: "" }} />
      <Stack.Screen name="dog-register" options={{ title: "", header: () => <OnboardingHeader step={2} total={2} fallbackHref="/region" /> }} />
    </Stack>
  );
}
