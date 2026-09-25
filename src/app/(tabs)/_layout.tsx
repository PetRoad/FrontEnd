import { Tabs } from "expo-router";
import { I, Icon } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";

export default function TabsLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.tint,
        tabBarInactiveTintColor: c.inkMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.hairline },
        sceneStyle: { backgroundColor: c.ground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "산책", tabBarIcon: ({ color }) => <Icon name={I.walk} size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="my"
        options={{ title: "마이", tabBarIcon: ({ color }) => <Icon name={I.person} size={24} color={color} /> }}
      />
    </Tabs>
  );
}
