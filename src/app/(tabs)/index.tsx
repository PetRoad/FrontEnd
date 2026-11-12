import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type MapView from "react-native-maps";
import type { LatLng } from "react-native-maps";
import Animated, { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { MapPlate } from "@/components/common/MapPlate";
import { FloatButton, Glass, GlassPlate, I, Icon, Logo, T } from "@/components/common/ui";
import { CourseCard } from "@/components/course/CourseCard";
import { gutter, mapEdge, radius, shadow, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useRecommended } from "@/services/course";
import { useUserStore } from "@/stores/userStore";
import { useWalkStore } from "@/stores/walkStore";
import { here } from "@/utils/location";

const MIN = 91; // 닫힌 시트: 손잡이 + 제목 + 부제만 남는다 (handle 스타일 높이 합)
const PEEK = MIN + 228 + 16; // 반쯤 열린 시트: 가로 코스 카드 한 줄까지
const START_GAP = 56 + space.md; // 산책 시작 버튼 높이 + 시트와의 간격
const OPEN_RATIO = 0.75; // 전체로 열어도 화면의 75%까지만 덮는다
const SPRING = { damping: 26, stiffness: 260, mass: 0.9 };

type Snap = "open" | "peek" | "closed";

export default function WalkHomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const region = useUserStore((s) => s.region);
  const map = useRef<MapView>(null);
  // 추천 기준 위치. undefined = 찾는 중, null = 권한이 없거나 위치를 못 받음
  const [at, setAt] = useState<LatLng | null>();
  useEffect(() => {
    here().then(setAt);
  }, []);
  const { data, error } = useRecommended(at);
  const list = data?.courses ?? [];
  const status = data
    ? `반경 ${data.radiusKm}km 안 ${list.length}곳 · 좋아요 많은 순`
    : at === null
      ? "위치를 허용하면 주변 코스를 추천해 드려요"
      : error
        ? "추천 코스를 불러오지 못했어요"
        : "주변 코스를 찾고 있어요";

  const [height, setHeight] = useState(0);
  const [state, setState] = useState<Snap>("closed");
  const open = state === "open";
  const points = { open: Math.round(height * (1 - OPEN_RATIO)), peek: height - PEEK, closed: height - MIN };
  const y = useSharedValue(10000);
  const startY = useSharedValue(0);
  const listRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const grabAt = useSharedValue(-1); // 목록을 끌다 시트를 잡기 시작한 순간의 손가락 이동량. -1이면 안 잡음

  const snap = (to: Snap) => {
    y.set(withSpring(points[to], SPRING));
    if (to !== "open") scrollY.set(0); // 다시 열면 목록이 맨 위부터 새로 그려진다
    setState(to);
  };
  // 탭: 닫힘 → 반 → 전체 → 반
  const next: Record<Snap, Snap> = { closed: "peek", peek: "open", open: "peek" };

  // 손을 놓은 속도만큼 조금 더 간 지점에서 가장 가까운 위치로 붙는다
  const settle = (velocityY: number) => {
    "worklet";
    const target = y.get() + velocityY * 0.15;
    const to = (["open", "peek", "closed"] as const).reduce((a, b) =>
      Math.abs(points[b] - target) < Math.abs(points[a] - target) ? b : a,
    );
    scheduleOnRN(snap, to);
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.set(y.get());
    })
    .onUpdate((e) => {
      y.set(Math.min(points.closed, Math.max(points.open, startY.get() + e.translationY)));
    })
    .onEnd((e) => settle(e.velocityY));
  const tap = Gesture.Tap().onEnd(() => {
    scheduleOnRN(snap, next[state]);
  });

  // 전체로 연 목록이 맨 위일 때 더 아래로 당기면 스크롤 대신 시트가 따라 내려온다
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  const listScroll = Gesture.Native();
  const listPan = Gesture.Pan()
    .enabled(open)
    .simultaneousWithExternalGesture(listScroll)
    .onBegin(() => {
      grabAt.set(-1);
    })
    // eslint-disable-next-line react-hooks/refs -- 제스처 콜백은 렌더가 아니라 UI 스레드에서 실행된다
    .onUpdate((e) => {
      if (grabAt.get() < 0) {
        if (scrollY.get() <= 0 && e.velocityY > 0) grabAt.set(e.translationY);
        return;
      }
      const to = points.open + e.translationY - grabAt.get();
      if (to <= points.open) {
        // 다시 끝까지 올렸으면 시트를 놓고 목록 스크롤로 돌아간다
        y.set(points.open);
        grabAt.set(-1);
        return;
      }
      y.set(Math.min(points.closed, to));
      scrollTo(listRef, 0, 0, false); // 시트를 끄는 동안 목록은 맨 위에 붙잡아 둔다
    })
    .onEnd((e) => {
      if (grabAt.get() >= 0) settle(e.velocityY);
    });
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  // 산책 시작 버튼은 시트 바로 위를 따라다닌다
  const startStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() - START_GAP }] }));

  const locate = async () => {
    const p = await here();
    if (!p) return;
    setAt(p); // 옮긴 자리 기준으로 추천도 다시 받는다
    map.current?.animateToRegion({ ...p, latitudeDelta: 0.008, longitudeDelta: 0.008 });
  };

  const startWalk = () => {
    useWalkStore.getState().start(`${region.split(" ").pop() ?? ""} 산책`);
    router.push("/walk/active");
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: c.background }}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        setHeight(h);
        y.set(state === "open" ? Math.round(h * (1 - OPEN_RATIO)) : h - (state === "closed" ? MIN : PEEK));
      }}
    >
      <MapPlate ref={map} style={s.map} marker />

      <View style={[s.topBar, { paddingTop: insets.top + space.sm }]}>
        <Glass r={radius.pill} style={s.regionPill}>
          <Icon name={I.pin} size={16} />
          <T w="semibold" numberOfLines={1} style={{ flexShrink: 1 }}>
            {region || "현재 위치"}
          </T>
        </Glass>
        <View style={{ marginLeft: "auto" }}>
          <FloatButton icon={I.locate} label="내 위치로 이동" onPress={locate} />
        </View>
      </View>

      <Animated.View style={[s.start, startStyle]}>
        <GlassPlate title="산책 시작하기" icon={<Logo size={18} color={c.onPrimary} />} onPress={startWalk} />
      </Animated.View>

      <Animated.View style={[s.sheet, { backgroundColor: c.background, height: Math.max(0, height - points.open) }, shadow.float, sheetStyle]}>
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <View
            style={s.handle}
            accessible
            accessibilityRole="button"
            accessibilityLabel={open ? "추천 코스 접기" : "추천 코스 펼치기"}
            accessibilityActions={[{ name: "activate" }, { name: "escape", label: "추천 코스 닫기" }]}
            onAccessibilityAction={(e) => snap(e.nativeEvent.actionName === "escape" ? "closed" : next[state])}
          >
            <View style={[s.grabber, { backgroundColor: c.borderStrong }]} />
            <T v="heading">우리 동네 추천 코스</T>
            <T v="bodySmall" muted>
              {status}
            </T>
          </View>
        </GestureDetector>

        {!data ? null : list.length === 0 ? (
          <T v="bodySmall" muted style={{ paddingHorizontal: gutter }}>
            아직 주변에 등록된 코스가 없어요. 첫 코스를 만들어보세요.
          </T>
        ) : (
          <GestureDetector gesture={listPan}>
            <GestureDetector gesture={listScroll}>
              <Animated.ScrollView
                key={String(open)}
                ref={listRef}
                horizontal={!open}
                onScroll={onScroll}
                scrollEventThrottle={16}
                // 맨 위에서 당길 때 고무줄 대신 시트가 움직이도록 전체 목록은 튕김을 끈다
                bounces={!open}
                overScrollMode={open ? "never" : "auto"}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={open ? s.listOpen : s.listPeek}
              >
                {list.map((course) => (
                  <CourseCard key={course.id} course={course} width={open ? undefined : 232} />
                ))}
              </Animated.ScrollView>
            </GestureDetector>
          </GestureDetector>
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  map: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  topBar: { position: "absolute", left: mapEdge, right: mapEdge, flexDirection: "row", alignItems: "center", gap: space.md },
  regionPill: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 6, height: 48, paddingHorizontal: space.lg },
  start: { position: "absolute", top: 0, left: mapEdge, right: mapEdge },
  sheet: { position: "absolute", left: 0, right: 0, top: 0, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet },
  // 높이 합 = MIN: 10 + 5 + 12 + 30(heading) + 20(bodySmall) + 14
  handle: { paddingTop: 10, paddingBottom: 14, paddingHorizontal: gutter },
  grabber: { alignSelf: "center", width: 36, height: 5, borderRadius: 3, marginBottom: space.md },
  listPeek: { gap: space.md, paddingHorizontal: gutter, paddingBottom: space.lg, alignItems: "flex-start" },
  listOpen: { gap: space.md, paddingHorizontal: gutter, paddingBottom: space.huge },
});
