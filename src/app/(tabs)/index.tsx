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

const PEEK = 304; // 반쯤 열린 시트가 보이는 높이 (가로 코스 카드까지)
const MIN = 84; // 닫힌 시트: 제목 줄만 남는다
const OPEN_RATIO = 0.75; // 전체로 열어도 화면의 75%까지만 덮는다
const SPRING = { damping: 26, stiffness: 260, mass: 0.9 };

type Snap = "open" | "peek" | "closed";

export default function WalkHomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const region = useUserStore((s) => s.region);
  const courses = useCourseStore((s) => s.courses);
  const { radius, list } = recommend(courses);

  const [height, setHeight] = useState(0);
  const [state, setState] = useState<Snap>("peek");
  const open = state === "open";
  const points = { open: Math.round(height * (1 - OPEN_RATIO)), peek: height - PEEK, closed: height - MIN };
  const y = useSharedValue(10000);
  const startY = useSharedValue(0);

  const snap = (to: Snap) => {
    y.set(withSpring(points[to], SPRING));
    setState(to);
  };
  // 탭: 닫힘 → 반 → 전체 → 반
  const next: Record<Snap, Snap> = { closed: "peek", peek: "open", open: "peek" };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.set(y.get());
    })
    .onUpdate((e) => {
      y.set(Math.min(points.closed, Math.max(points.open, startY.get() + e.translationY)));
    })
    .onEnd((e) => {
      // 손을 놓은 속도만큼 조금 더 간 지점에서 가장 가까운 위치로 붙는다
      const target = y.get() + e.velocityY * 0.15;
      const to = (["open", "peek", "closed"] as const).reduce((a, b) =>
        Math.abs(points[b] - target) < Math.abs(points[a] - target) ? b : a,
      );
      y.set(withSpring(points[to], SPRING));
      scheduleOnRN(setState, to);
    });
  const tap = Gesture.Tap().onEnd(() => {
    scheduleOnRN(snap, next[state]);
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  // 산책 시작 버튼은 시트 바로 위를 따라다닌다
  const startStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() - 56 - 12 }] }));

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
        y.set(state === "open" ? Math.round(h * (1 - OPEN_RATIO)) : h - (state === "closed" ? MIN : PEEK));
      }}
    >
      <MapPlate style={s.map} marker />

      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={[s.regionPill, { backgroundColor: c.surface }, shadow]}>
          <Icon name={I.pin} size={16} color={c.inkMuted} />
          <T v="headline" numberOfLines={1}>
            {region || "현재 위치"}
          </T>
        </View>
        {/* ponytail: 위치 재설정은 react-native-maps 연결 시 animateToRegion으로 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="내 위치로 이동"
          style={({ pressed }) => [s.locate, { backgroundColor: c.surface, opacity: pressed ? 0.7 : 1 }, shadow]}
        >
          <Icon name={I.locate} size={20} color={c.ink} />
        </Pressable>
      </View>

      <Animated.View style={[s.start, startStyle]}>
        <Plate title="산책 시작하기" icon={I.walk} onPress={startWalk} style={shadow} />
      </Animated.View>

      <Animated.View style={[s.sheet, { backgroundColor: c.accentSoft, height: Math.max(0, height - points.open) }, sheetStyle]}>
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <View
            style={s.handle}
            accessible
            accessibilityRole="button"
            accessibilityLabel={open ? "추천 코스 접기" : "추천 코스 펼치기"}
            accessibilityActions={[{ name: "activate" }, { name: "escape", label: "추천 코스 닫기" }]}
            onAccessibilityAction={(e) => snap(e.nativeEvent.actionName === "escape" ? "closed" : next[state])}
          >
            <View style={[s.grabber, { backgroundColor: c.inkMuted }]} />
            <T v="title3">
              우리 동네 추천코스
            </T>
            <T v="footnote" muted>
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
            <T v="subhead" muted>
              아직 주변에 등록된 코스가 없어요. 첫 코스를 만들어보세요.
            </T>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  map: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  topBar: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  regionPill: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 6, height: 44, paddingHorizontal: 16, borderRadius: 22 },
  locate: { marginLeft: "auto", width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  start: { position: "absolute", top: 0, left: 16, right: 16 },
  sheet: { position: "absolute", left: 0, right: 0, top: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" },
  handle: { alignItems: "center", paddingTop: 8, paddingBottom: 14, gap: 2 },
  grabber: { width: 36, height: 5, borderRadius: 3, marginBottom: 10, opacity: 0.6 },
  listPeek: { gap: 12, paddingHorizontal: 16, paddingBottom: 16, alignItems: "flex-start" },
  listOpen: { gap: 14, paddingHorizontal: 16, paddingBottom: 48 },
});
