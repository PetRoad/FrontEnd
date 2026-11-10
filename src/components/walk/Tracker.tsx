import { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPlate } from "@/components/common/MapPlate";
import { FloatButton, Glass, GlassPlate, I, Num, T } from "@/components/common/ui";
import { font, mapEdge, radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import type { Course } from "@/types/course";
import { confirm } from "@/utils/confirm";
import { clock } from "@/utils/format";

const CONTROLS = 56; // 하단 사진·종료 버튼 높이
// ponytail: GPS 튐은 이 두 값으로만 거른다. 실제로 걸어보고 거리가 부풀면 값을 조정하고, 그래도 안 되면 필터를 붙인다
const MIN_STEP_M = 5; // 이만큼 움직여야 새 점을 받는다
const MAX_ERROR_M = 30; // 오차가 이보다 큰 점은 버린다

// 자유 산책 / 코스 따라 걷기 공용 진행 화면. 지도가 화면 전체, 위에 코스 정보 카드
export function Tracker({ course }: { course?: Course }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const walk = useWalkStore((s) => s.current);

  // 화면이 꺼지면 GPS 기록도 멈추므로(앱이 앞에 있을 때만 받음) 산책 중엔 켜 둔다
  useKeepAwake();

  useEffect(() => {
    const id = setInterval(useWalkStore.getState().tick, 1000);
    let sub: Location.LocationSubscription | undefined;
    let gone = false;
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return Alert.alert("위치 권한이 필요해요.", "설정에서 위치를 허용해야 걸은 길을 기록할 수 있어요.");
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: MIN_STEP_M }, ({ coords }) => {
        if (coords.accuracy != null && coords.accuracy > MAX_ERROR_M) return;
        useWalkStore.getState().move({ latitude: coords.latitude, longitude: coords.longitude });
      });
      if (gone) sub.remove(); // 구독이 열리기 전에 화면을 떠난 경우
    })();
    return () => {
      gone = true;
      clearInterval(id);
      sub?.remove();
    };
  }, []);

  if (!walk) return null;

  const end = () =>
    confirm({
      title: "산책을 마칠까요?",
      message: "지금까지 걸은 기록으로 결과를 보여드려요.",
      ok: "마치기",
      cancel: "계속 걷기",
      onOk: () => {
        useWalkStore.getState().finish();
        router.replace("/walk/result");
      },
    });

  // 시스템 카메라로 한 장 찍어 산책에 붙인다. 취소하면 아무것도 안 한다
  // ponytail: 안드로이드는 카메라 화면으로 넘어간 동안 위치 기록이 멈출 수 있다(iOS는 앱 위 모달이라 계속 기록). 안드로이드 출시 전 백그라운드 위치로 보강
  const shoot = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("카메라 권한이 필요해요.", "설정에서 카메라를 허용해야 산책 중 사진을 찍을 수 있어요.");
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!r.canceled) useWalkStore.getState().addPhoto(r.assets[0].uri);
  };

  const km = walk.distanceKm.toFixed(2);
  const bottom = insets.bottom + space.lg;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <MapPlate style={StyleSheet.absoluteFill} marker follow route={walk.route} />

      {/* 한 줄 바: 왼쪽 코스 이름, 오른쪽 수치. 따라 걷기는 걸은 거리 | 코스 전체, 자유산책은 시간 | 걸은 거리 */}
      <Glass
        accessible
        accessibilityLabel={
          course
            ? `${course.name}, ${course.distanceKm}킬로미터 중 ${km}킬로미터 걸었어요`
            : `자유산책, ${clock(walk.durationSec)}, ${km}킬로미터 걸었어요`
        }
        r={radius.button}
        tint={c.primary}
        style={[s.panel, { top: insets.top + space.sm }]}
      >
        <T w="semibold" color={c.onPrimary} numberOfLines={1} style={{ flex: 1 }}>
          {course ? course.name : "자유산책"}
        </T>
        <Num color={c.onPrimary} style={{ fontFamily: font.medium }}>
          {course ? `${km}km` : clock(walk.durationSec)}
        </Num>
        <View style={[s.divider, { backgroundColor: c.onPrimary }]} />
        <Num bold color={c.onPrimary}>
          {course ? `${course.distanceKm.toFixed(2)}km` : `${km}km`}
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

// 지도 위 경로 구분은 기존 색 그대로: 원래 코스 로고색 점선, 내가 걸은 길 갈색 실선
function Legend({ bottom }: { bottom: number }) {
  const c = useTheme();
  return (
    <Glass r={radius.button} style={[s.legend, { bottom }]}>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.swatchDash, { backgroundColor: c.primary }]} />
          ))}
        </View>
        <T v="caption" w="medium">
          원래 코스
        </T>
      </View>
      <View style={s.legendRow}>
        <View style={[s.swatch, { height: 4, borderRadius: 2, backgroundColor: c.route }]} />
        <T v="caption" w="medium">
          내가 걸은 길
        </T>
      </View>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          <View style={[s.swatchDot, { backgroundColor: c.primary, borderColor: c.route }]} />
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
    paddingHorizontal: space.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
  },
  divider: { width: 1, height: 14, opacity: 0.3 },
  controls: { position: "absolute", left: mapEdge, right: mapEdge, flexDirection: "row", alignItems: "center", gap: space.md },
  legend: { position: "absolute", left: mapEdge, padding: space.md, gap: space.sm },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  swatch: { width: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  swatchDash: { width: 6, height: 6, borderRadius: 3 },
  swatchDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginLeft: 7 },
});
