import { Stack } from "expo-router";
import { useStackOptions } from "@/hooks/useTheme";

export default function AuthLayout() {
  return (
    <Stack screenOptions={useStackOptions()}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "" }} />
      <Stack.Screen name="region" options={{ title: "" }} />
      <Stack.Screen name="dog-register" options={{ title: "" }} />
    </Stack>
  );
}
