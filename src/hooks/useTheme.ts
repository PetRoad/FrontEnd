import { font, palette, type Palette } from "@/constants/theme";

// 밝은 테마 하나만 쓴다 (app.json userInterfaceStyle: light)
export function useTheme(): Palette {
  return palette;
}

export function useStackOptions() {
  const c = useTheme();
  return {
    headerTintColor: c.textPrimary,
    headerTitleStyle: { color: c.textPrimary, fontFamily: font.semibold },
    headerStyle: { backgroundColor: c.background },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal" as const,
    contentStyle: { backgroundColor: c.background },
  };
}
