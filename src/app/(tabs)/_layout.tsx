import { Tabs } from "expo-router";
import { I, Icon, Logo } from "@/components/common/ui";
import { font } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.textPrimary,
        tabBarInactiveTintColor: c.textTertiary,
        tabBarLabelStyle: { fontFamily: font.medium },
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.borderSubtle },
        sceneStyle: { backgroundColor: c.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "산책", tabBarIcon: ({ color }) => <Logo size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="my"
        options={{ title: "마이", tabBarIcon: ({ color }) => <Icon name={I.person} size={24} color={color} /> }}
      />
    </Tabs>
  );
}
