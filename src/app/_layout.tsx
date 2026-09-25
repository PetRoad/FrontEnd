import { useEffect } from "react";
import { BarlowCondensed_600SemiBold } from "@expo-google-fonts/barlow-condensed/600SemiBold";
import { BarlowCondensed_700Bold } from "@expo-google-fonts/barlow-condensed/700Bold";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import QueryProvider from "@/providers/QueryProvider";
import { useStackOptions } from "@/hooks/useTheme";
import { useUserStore } from "@/stores/userStore";

SplashScreen.preventAutoHideAsync();

// 걷는 중 기록이 날아가지 않도록 스와이프 뒤로가기를 막는 화면
const guarded = { gestureEnabled: false, headerBackVisible: false };

export default function RootLayout() {
  const onboarded = useUserStore((s) => s.onboarded);
  const stackOptions = useStackOptions();
  const [loaded, error] = useFonts({ BarlowCondensed_600SemiBold, BarlowCondensed_700Bold });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={stackOptions}>
          <Stack.Protected guard={!onboarded}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={onboarded}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "산책" }} />
            <Stack.Screen name="course/[id]" options={{ title: "코스" }} />
            <Stack.Screen name="walk/active" options={{ headerShown: false, ...guarded }} />
            <Stack.Screen name="walk/follow" options={{ headerShown: false, ...guarded }} />
            <Stack.Screen name="walk/result" options={{ title: "산책 결과", ...guarded }} />
            <Stack.Screen name="walk/register" options={{ title: "코스 등록" }} />
            <Stack.Screen name="my/dog" options={{ title: "반려견 프로필" }} />
            <Stack.Screen name="my/walks" options={{ title: "산책일지" }} />
            <Stack.Screen name="my/walk/[id]" options={{ title: "산책일지" }} />
            <Stack.Screen name="my/album" options={{ title: "산책 앨범" }} />
            <Stack.Screen name="my/courses" options={{ title: "내가 만든 코스" }} />
            <Stack.Screen name="my/likes" options={{ title: "좋아요한 코스" }} />
          </Stack.Protected>
        </Stack>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
