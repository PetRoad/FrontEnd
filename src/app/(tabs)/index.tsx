import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { I, Icon, MapPlate, Plate, T, shadow } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { recommend } from "@/features/course/recommend";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import { useUserStore } from "@/stores/userStore";
import { useWalkStore } from "@/stores/walkStore";

const PEEK = 304; // 접힌 시트가 보이는 높이
const SPRING = { damping: 26, stiffness: 260, mass: 0.9 };

export default function WalkHomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const region = useUserStore((s) => s.region);
  const courses = useCourseStore((s) => s.courses);
  const { radius, list } = recommend(courses);

  const [height, setHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const openY = insets.top + 8;
  const closedY = height - PEEK;
  const y = useSharedValue(10000);
  const startY = useSharedValue(0);

  const snap = (toOpen: boolean) => {
    y.set(withSpring(toOpen ? openY : closedY, SPRING));
    setOpen(toOpen);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.set(y.get());
    })
    .onUpdate((e) => {
      y.set(Math.min(closedY, Math.max(openY, startY.get() + e.translationY)));
    })
    .onEnd((e) => {
      const toOpen = e.velocityY < -500 || (e.velocityY < 500 && y.get() < (openY + closedY) / 2);
      y.set(withSpring(toOpen ? openY : closedY, SPRING));
      scheduleOnRN(setOpen, toOpen);
    });
  const tap = Gesture.Tap().onEnd(() => {
    scheduleOnRN(snap, !open);
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));

  const startWalk = () => {
    useWalkStore.getState().start(`${region.split(" ").pop() ?? ""} 산책`);
    router.push("/walk/active");
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: c.ground }}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        setHeight(h);
        y.set(open ? openY : h - PEEK);
      }}
    >
      <MapPlate style={[s.map, { bottom: PEEK - 24 }]} marker />

      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={[s.regionPill, { backgroundColor: c.raised }, shadow]}>
          <Icon name={I.pin} size={16} color={c.tint} />
          <T v="headline" numberOfLines={1}>
            {region || "현재 위치"}
          </T>
        </View>
        {/* ponytail: 위치 재설정은 react-native-maps 연결 시 animateToRegion으로 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="내 위치로 이동"
          style={({ pressed }) => [s.locate, { backgroundColor: c.raised, opacity: pressed ? 0.7 : 1 }, shadow]}
        >
          <Icon name={I.locate} size={20} color={c.tint} />
        </Pressable>
      </View>

      <Plate title="산책 시작하기" icon={I.walk} onPress={startWalk} style={[s.start, { bottom: PEEK + 12 }, shadow]} />

      <Animated.View style={[s.sheet, { backgroundColor: c.track, height: Math.max(0, height - openY) }, sheetStyle]}>
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <View
            style={s.handle}
            accessible
            accessibilityRole="button"
            accessibilityLabel={open ? "추천 코스 접기" : "추천 코스 펼치기"}
            onAccessibilityTap={() => snap(!open)}
          >
            <View style={[s.grabber, { backgroundColor: c.onTrackMuted }]} />
            <T v="title3" color={c.onTrack}>
              우리 동네 추천코스
            </T>
            <T v="footnote" color={c.onTrackMuted}>
              반경 {radius}km 안 {list.length}곳 · 좋아요 많은 순
            </T>
          </View>
        </GestureDetector>

        <ScrollView
          key={String(open)}
          horizontal={!open}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={open ? s.listOpen : s.listPeek}
        >
          {list.map((course) => (
            <CourseCard key={course.id} course={course} width={open ? undefined : 232} />
          ))}
          {list.length === 0 && (
            <T v="subhead" color={c.onTrackMuted}>
              아직 주변에 등록된 코스가 없어요. 첫 코스를 만들어보세요.
            </T>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  map: { position: "absolute", top: 0, left: 0, right: 0 },
  topBar: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  regionPill: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 6, height: 44, paddingHorizontal: 16, borderRadius: 22 },
  locate: { marginLeft: "auto", width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  start: { position: "absolute", left: 16, right: 16 },
  sheet: { position: "absolute", left: 0, right: 0, top: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" },
  handle: { alignItems: "center", paddingTop: 8, paddingBottom: 14, gap: 2 },
  grabber: { width: 36, height: 5, borderRadius: 3, marginBottom: 10, opacity: 0.6 },
  listPeek: { gap: 12, paddingHorizontal: 16, paddingBottom: 16, alignItems: "flex-start" },
  listOpen: { gap: 14, paddingHorizontal: 16, paddingBottom: 48 },
});
