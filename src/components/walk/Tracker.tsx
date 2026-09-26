import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, I, MapPlate, Num, Plate, T, shadow } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import type { Course } from "@/types/course";
import { confirm } from "@/utils/confirm";
import { clock } from "@/utils/format";

const BAR = 80; // 하단 버튼 영역 높이 (안전영역 제외)

// 자유 산책 / 코스 따라 걷기 공용 진행 화면. 지도가 화면 전체, 위에 코스 정보 카드
export function Tracker({ course }: { course?: Course }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const walk = useWalkStore((s) => s.current);

  useEffect(() => {
    const id = setInterval(useWalkStore.getState().tick, 1000);
    return () => clearInterval(id);
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

  const walked = `${walk.distanceKm.toFixed(2)}km`;

  return (
    <View style={{ flex: 1, backgroundColor: c.ground }}>
      <MapPlate style={StyleSheet.absoluteFill} marker />

      {/* 코스 이름 · 걸은 거리 | 코스 전체 길이. 자유 산책은 남은 거리가 없으니 걸은 거리만 */}
      <View
        accessible
        accessibilityLabel={
          course
            ? `${course.name}, ${course.distanceKm}킬로미터 중 ${walk.distanceKm.toFixed(2)}킬로미터 걸었어요`
            : `자유 산책, ${walk.distanceKm.toFixed(2)}킬로미터 걸었어요`
        }
        style={[s.banner, { top: insets.top + 8, backgroundColor: c.accent }, shadow]}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <T v="headline" color={c.onAccent} numberOfLines={1}>
            {course ? course.name : "자유 산책"}
          </T>
          <T v="footnote" color={c.onAccent}>
            산책 중 · {clock(walk.durationSec)}
          </T>
        </View>
        <View style={s.distance}>
          <Num size={20} bold color={c.onAccent}>
            {walked}
          </Num>
          {course && (
            <>
              <View style={[s.divider, { backgroundColor: c.onAccent }]} />
              <Num size={20} color={c.onAccent}>
                {course.distanceKm.toFixed(2)}km
              </Num>
            </>
          )}
        </View>
      </View>

      {course && <Legend bottom={insets.bottom + BAR + 16} />}

      <View style={[s.bar, { backgroundColor: c.surface, paddingBottom: insets.bottom + 12 }, shadow]}>
        {/* ponytail: 사진 자리만 추가. expo-camera 촬영으로 교체 */}
        <Btn
          tone="soft"
          title={walk.photos.length ? `사진 ${walk.photos.length}` : "사진"}
          icon={I.camera}
          onPress={useWalkStore.getState().addPhoto}
          style={s.half}
        />
        <Plate title="종료" icon={I.stop} onPress={end} style={s.half} />
      </View>
    </View>
  );
}

function Legend({ bottom }: { bottom: number }) {
  const c = useTheme();
  return (
    <View style={[s.legend, { bottom, backgroundColor: c.surface }, shadow]}>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.swatchDash, { backgroundColor: c.accent }]} />
          ))}
        </View>
        <T v="footnote">원래 코스</T>
      </View>
      <View style={s.legendRow}>
        <View style={[s.swatch, { height: 4, borderRadius: 2, backgroundColor: c.tint }]} />
        <T v="footnote">내가 걸은 길</T>
      </View>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          <View style={[s.swatchDot, { backgroundColor: c.accent, borderColor: c.tint }]} />
        </View>
        <T v="footnote">내 위치</T>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
  },
  distance: { flexDirection: "row", alignItems: "center", gap: 10 },
  divider: { width: 1.5, height: 18, borderRadius: 1, opacity: 0.5 },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  half: { flex: 1, height: 56 },
  legend: { position: "absolute", left: 16, borderRadius: 14, padding: 12, gap: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  swatch: { width: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  swatchDash: { width: 6, height: 6, borderRadius: 3 },
  swatchDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginLeft: 7 },
});
