import { palette, type Palette } from "@/constants/colors";

// 밝은 테마 하나만 쓴다 (app.json userInterfaceStyle: light)
export function useTheme(): Palette {
  return palette;
}

export function useStackOptions() {
  const c = useTheme();
  return {
    headerTintColor: c.ink,
    headerTitleStyle: { color: c.ink },
    headerStyle: { backgroundColor: c.ground },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal" as const,
    contentStyle: { backgroundColor: c.ground },
  };
}
