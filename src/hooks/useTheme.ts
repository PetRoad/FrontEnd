import { useColorScheme } from "react-native";
import { palettes, type Palette } from "@/constants/colors";

export function useTheme(): Palette {
  return palettes[useColorScheme() === "dark" ? "dark" : "light"];
}

export function useStackOptions() {
  const c = useTheme();
  return {
    headerTintColor: c.tint,
    headerTitleStyle: { color: c.ink },
    headerStyle: { backgroundColor: c.ground },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal" as const,
    contentStyle: { backgroundColor: c.ground },
  };
}
