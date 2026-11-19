import { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPlate } from "@/components/common/MapPlate";
import { FloatButton, Glass, GlassPlate, I, Num, T } from "@/components/common/ui";
import { font, mapEdge, radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { startTracking } from "@/services/track";
import { useWalkStore } from "@/stores/walkStore";
import type { Course } from "@/types/course";
import { confirm } from "@/utils/confirm";
import { follow } from "@/utils/follow";
import { clock, distance, spokenDistance } from "@/utils/format";

const CONTROLS = 56; // 하단 사진·종료 버튼 높이

// 자유 산책 / 코스 따라 걷기 공용 진행 화면. 지도가 화면 전체, 위에 코스 정보 카드
export function Tracker({ course }: { course?: Course }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const walk = useWalkStore((s) => s.current);

  // 화면이 꺼지거나 다른 앱으로 넘어가도 경로는 계속 기록된다(services/track). 이 화면을 떠나면 멈춘다
  useEffect(() => {
    const id = setInterval(useWalkStore.getState().tick, 1000);
    let stop: (() => void) | undefined;
    let gone = false;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return Alert.alert("위치 권한이 필요해요.", "설정에서 위치를 허용해야 걸은 길을 기록할 수 있어요.");
      stop = await startTracking();
      if (gone) stop(); // 기록이 시작되기 전에 화면을 떠난 경우
    })();
    return () => {
      gone = true;
      clearInterval(id);
      stop?.();
    };
  }, []);

  // 따라 걷기: 걸은 GPS 점으로 코스 중 지나간 구간과 완주율을 구한다. GPS 점이 새로 들어올 때마다 다시 계산
  const progress = course?.route ? follow(course.route, walk?.route ?? []) : undefined;

  if (!walk) return null;

  const end = () =>
    confirm({
      title: "산책을 마칠까요?",
      message: "지금까지 걸은 기록으로 결과를 보여드려요.",
      ok: "마치기",
      cancel: "계속 걷기",
      onOk: () => {
        useWalkStore.getState().finish(progress?.completion);
        router.replace("/walk/result");
      },
    });

  // 시스템 카메라로 한 장 찍어 산책에 붙인다. 취소하면 아무것도 안 한다
  const shoot = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("카메라 권한이 필요해요.", "설정에서 카메라를 허용해야 산책 중 사진을 찍을 수 있어요.");
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!r.canceled) useWalkStore.getState().addPhoto(r.assets[0].uri);
  };

  const walked = distance(walk.distanceKm);
  const bottom = insets.bottom + space.lg;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* 따라 걷기는 GPS 선을 그리지 않고 회색 코스를 채운다. GPS 오차로 선이 코스 옆에 그려지지 않게 */}
      <MapPlate
        style={StyleSheet.absoluteFill}
        marker
        follow
        route={progress ? undefined : walk.route}
        course={course?.route}
        done={progress?.done}
      />

      {/* 한 줄 바: 왼쪽 코스 이름, 오른쪽 수치. 따라 걷기는 걸은 거리 | 코스 전체, 자유산책은 시간 | 걸은 거리 */}
      <Glass
        accessible
        accessibilityLabel={
          course
            ? `${course.name}, ${spokenDistance(course.distanceKm)} 중 ${spokenDistance(walk.distanceKm)} 걸었어요`
            : `자유산책, ${clock(walk.durationSec)}, ${spokenDistance(walk.distanceKm)} 걸었어요`
        }
        r={radius.pill}
        tint={c.primary}
        style={[s.panel, { top: insets.top + space.sm }]}
      >
        <T w="semibold" color={c.onPrimary} numberOfLines={1} style={{ flex: 1 }}>
          {course ? course.name : "자유산책"}
        </T>
        <Num color={c.onPrimary} style={{ fontFamily: font.medium }}>
          {course ? walked : clock(walk.durationSec)}
        </Num>
        <View style={[s.divider, { backgroundColor: c.onPrimary }]} />
        <Num bold color={c.onPrimary}>
          {course ? distance(course.distanceKm) : walked}
        </Num>
      </Glass>

      {course && <Legend bottom={bottom + CONTROLS + space.md} />}

      <View style={[s.controls, { bottom }]}>
        <FloatButton
          icon={I.camera}
          label={walk.photos.length ? `사진 찍기, ${walk.photos.length}장 찍음` : "사진 찍기"}
          onPress={shoot}
          size={CONTROLS}
          badge={walk.photos.length}
        />
        <GlassPlate title="산책 종료" icon={I.stop} onPress={end} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

// 지도에 실제로 그려지는 것만 적는다: 남은 코스 회색, 걸은 코스 갈색(회색 위를 덮으며 채워진다),
// 내 위치는 OS가 그리는 파란 점(마커를 직접 그리지 않고 OS 것을 쓴다 - 방향·정확도 원이 공짜로 따라온다)
function Legend({ bottom }: { bottom: number }) {
  const c = useTheme();
  return (
    <Glass r={radius.button} style={[s.legend, { bottom }]}>
      <View style={s.legendRow}>
        <View style={[s.swatch, s.swatchLine, { backgroundColor: c.courseDim }]} />
        <T v="caption" w="medium">
          남은 코스
        </T>
      </View>
      <View style={s.legendRow}>
        <View style={[s.swatch, s.swatchLine, { backgroundColor: c.route }]} />
        <T v="caption" w="medium">
          걸은 코스
        </T>
      </View>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          <View style={[s.swatchDot, { backgroundColor: c.userDot, borderColor: c.onPrimary }]} />
        </View>
        <T v="caption" w="medium">
          내 위치
        </T>
      </View>
    </Glass>
  );
}

const s = StyleSheet.create({
  panel: {
    position: "absolute",
    left: mapEdge,
    right: mapEdge,
    minHeight: 52,
    paddingHorizontal: space.xxl, // 양 끝이 반원이라 글자가 곡선에 붙지 않게
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  divider: { width: 1, height: 14, opacity: 0.3 },
  controls: { position: "absolute", left: mapEdge, right: mapEdge, flexDirection: "row", alignItems: "center", gap: space.md },
  legend: { position: "absolute", left: mapEdge, padding: space.md, gap: space.sm },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  swatch: { width: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  swatchLine: { height: 4, borderRadius: 2 },
  swatchDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginLeft: 7 },
});
