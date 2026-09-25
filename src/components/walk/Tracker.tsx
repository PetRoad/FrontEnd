import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, I, Lane, MapPlate, Num, Plate, Stat, T, shadow } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { useWalkStore } from "@/stores/walkStore";
import type { Course } from "@/types/course";
import { confirm } from "@/utils/confirm";
import { clock } from "@/utils/format";

// 자유 산책 / 코스 따라 걷기 공용 진행 화면. 아래 트랙 면에 거리 표지가 칠해진다
export function Tracker({ course }: { course?: Course }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const walk = useWalkStore((s) => s.current);

  useEffect(() => {
    const id = setInterval(useWalkStore.getState().tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!walk) return null;

  const meters = Math.floor(walk.distanceKm * 1000);
  const passedKm = Math.floor(meters / 1000);
  const toNext = 100 - (meters % 100);

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

  return (
    <View style={{ flex: 1, backgroundColor: c.ground }}>
      <MapPlate style={{ flex: 1 }} marker>
        <View style={[s.top, { paddingTop: insets.top + 8 }]}>
          <View style={[s.pill, { backgroundColor: c.raised }, shadow]}>
            <View style={[s.rec, { backgroundColor: c.paint }]} />
            <T v="subhead" numberOfLines={1} style={{ fontWeight: "600", flexShrink: 1 }}>
              {course ? course.name : "자유 산책"}
            </T>
            <T v="subhead" muted>
              기록 중
            </T>
          </View>
        </View>
        {course && <Legend />}
      </MapPlate>

      <View style={[s.track, { backgroundColor: c.track, paddingBottom: insets.bottom + 16 }]}>
        <View>
          <View style={s.distance}>
            <Num size={96} bold color={c.onTrack}>
              {walk.distanceKm.toFixed(2)}
            </Num>
            <Num size={32} color={c.onTrackMuted}>
              KM
            </Num>
          </View>
          <T v="footnote" color={c.onTrackMuted}>
            거리
          </T>
        </View>

        <View style={{ gap: 8 }}>
          <Lane total={10} filled={Math.floor(meters / 100) % 10} on={c.paint} off="rgba(255, 255, 255, 0.18)" />
          <T v="footnote" color={c.onTrackMuted}>
            {passedKm > 0 ? `${passedKm}km 표지 통과 · ` : ""}다음 100m 표지까지 {toNext}m
          </T>
        </View>

        <View style={s.stats}>
          <Stat value={clock(walk.durationSec)} label="시간" onTrack />
          <Stat value={String(walk.photos.length)} unit="장" label="사진" onTrack />
          {course && <Stat value={course.distanceKm.toFixed(1)} unit="KM" label="코스 거리" onTrack />}
        </View>

        <View style={s.actions}>
          {/* ponytail: 사진 자리만 추가. expo-camera 촬영으로 교체 */}
          <Btn tone="onTrack" title="사진" icon={I.camera} onPress={useWalkStore.getState().addPhoto} style={s.half} />
          <Plate title="종료" icon={I.stop} onPress={end} style={s.half} />
        </View>
      </View>
    </View>
  );
}

function Legend() {
  const c = useTheme();
  return (
    <View style={[s.legend, { backgroundColor: c.raised }, shadow]}>
      <View style={s.legendRow}>
        <View style={s.swatch}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.swatchDash, { backgroundColor: c.paint }]} />
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
          <View style={[s.swatchDot, { backgroundColor: c.tint, borderColor: c.onTrack }]} />
        </View>
        <T v="footnote">내 위치</T>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  top: { paddingHorizontal: 16, alignItems: "flex-start" },
  pill: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, height: 40, borderRadius: 20, maxWidth: "100%" },
  rec: { width: 10, height: 10, borderRadius: 5 },
  track: { borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingTop: 20, paddingHorizontal: 20, gap: 18 },
  distance: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  stats: { flexDirection: "row", gap: 28 },
  actions: { flexDirection: "row", gap: 10 },
  half: { flex: 1, height: 56 },
  legend: { position: "absolute", left: 16, bottom: 40, borderRadius: 12, padding: 12, gap: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  swatch: { width: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  swatchDash: { width: 7, height: 4, borderRadius: 2 },
  swatchDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, marginLeft: 7 },
});
