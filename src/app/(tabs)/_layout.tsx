import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "산책",
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: "마이",
        }}
      />
    </Tabs>
  );
}
