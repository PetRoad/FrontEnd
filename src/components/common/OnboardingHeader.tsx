import { Platform, Pressable, StyleSheet, View } from "react-native";
import { router, type Href } from "expo-router";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Glass, Icon, Steps } from "@/components/common/ui";
import { gutter, radius, shadow, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = { step: number; total: number; fallbackHref: Href };

// 온보딩 뒤로가기와 진행률을 한 줄로 묶어 상단에 유지한다.
export function OnboardingHeader({ step, total, fallbackHref }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const nativeGlass = Platform.OS === "ios" && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  const backIcon = <Icon name={{ ios: "chevron.left", android: "chevron_left" }} size={22} />;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallbackHref);
  };

  return (
    <View style={[s.header, { paddingTop: insets.top + space.sm, backgroundColor: c.background }]}>
      <View style={s.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이전 단계로 돌아가기"
          onPress={goBack}
          style={({ pressed }) => [s.back, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
        >
          {nativeGlass ? (
            <GlassView glassEffectStyle="regular" colorScheme="light" isInteractive style={s.surface}>
              {backIcon}
            </GlassView>
          ) : (
            <Glass r={radius.pill} style={[s.surface, shadow.subtle, { borderColor: c.borderSubtle }]}>
              {backIcon}
            </Glass>
          )}
        </Pressable>
        <View style={s.progress}>
          <Steps step={step} total={total} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: gutter, paddingBottom: space.sm },
  row: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: space.lg },
  back: { width: 44, height: 44, borderRadius: radius.pill },
  surface: { width: 44, height: 44, borderRadius: radius.pill, borderCurve: "continuous", alignItems: "center", justifyContent: "center" },
  progress: { flex: 1 },
});
