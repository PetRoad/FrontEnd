import { useEffect, useRef, type RefObject } from "react";
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import MapView, { Marker, Polyline, type LatLng } from "react-native-maps";
import Animated, { Easing, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { I, Icon } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { here } from "@/utils/location";

// 내 위치를 아직 모를 때 보여줄 곳: 성북구
const START = { latitude: 37.5894, longitude: 127.0167, latitudeDelta: 0.02, longitudeDelta: 0.02 };
const NEAR = { latitudeDelta: 0.008, longitudeDelta: 0.008 }; // 내 위치로 옮길 때 확대 정도
const PAD = { top: 40, right: 40, bottom: 40, left: 40 };

// 코스 마커: 평소엔 대표 사진이 든 원, 고르면 아래가 뾰족한 핀으로 바뀐다
// 45도 돌린 네모의 세 모서리를 둥글려 원을 만들고, 아래로 향한 한 모서리만 펴서 핀 끝을 만든다
const PIN = 40; // 원 지름
const PIN_TIP = 4; // 핀 끝의 둥글기
const PIN_GROW = 1.25; // 골랐을 때 커지는 비율
// 핀 끝이 좌표에 닿도록 원 중심을 끝까지의 거리만큼 올린다
const PIN_LIFT = (PIN * Math.SQRT1_2 - PIN_TIP * (Math.SQRT2 - 1)) * PIN_GROW;
const PIN_UP = Math.ceil(PIN_LIFT + (PIN / 2) * PIN_GROW) + 2; // 좌표 위로 필요한 높이
const PIN_DOWN = PIN / 2 + 2; // 좌표 아래로 필요한 높이
// 마커의 누를 수 있는 영역. 핀으로 커져도 넘치지 않게 고정한다
const PIN_BOX = { width: Math.ceil(PIN * PIN_GROW) + 4, height: PIN_UP + PIN_DOWN };
const PIN_OFFSET = { x: 0, y: PIN_BOX.height / 2 - PIN_UP }; // 상자 가운데에서 좌표 자리까지 민다
const LIKED = 16; // 좋아요 하트 배지 지름

type Pin = { id: string; name: string; cover?: string; liked?: boolean; start?: LatLng };

function CoursePin({ pin, at, on, onPress }: { pin: Pin; at: LatLng; on: boolean; onPress: () => void }) {
  const c = useTheme();
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withTiming(on ? 1 : 0, { duration: 280, easing: Easing.out(Easing.cubic) }));
  }, [on, t]);
  // 원과 하트를 같이 올리고 키운다. 모양(돌린 네모)만 따로 둥글기와 색을 바꾼다
  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: -PIN_LIFT * t.get() }, { scale: interpolate(t.get(), [0, 1], [1, PIN_GROW]) }],
  }));
  const shape = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.get(), [0, 1], [c.surface, c.primary]),
    borderColor: interpolateColor(t.get(), [0, 1], [c.borderStrong, c.primary]),
    borderBottomRightRadius: interpolate(t.get(), [0, 1], [PIN / 2, PIN_TIP]),
  }));
  return (
    <Marker coordinate={at} centerOffset={PIN_OFFSET} zIndex={on ? 1 : 0} onPress={onPress} accessibilityLabel={`${pin.name} 시작 위치`}>
      {/* react-native-maps(iOS 새 아키텍처)는 마커의 누를 수 있는 크기를 첫 번째 자식 뷰 크기로 잡는다.
          크기만 있는 View는 새 아키텍처가 지워 버려서(view flattening) 안쪽 원이 첫 자식이 되고, 그러면 누를 영역이 그려진 자리와 어긋난다.
          collapsable={false}로 이 상자를 남겨 누를 영역을 상자 전체로 고정한다 */}
      <View collapsable={false} style={PIN_BOX}>
        <Animated.View style={[s.pin, lift]}>
          <Animated.View style={[s.pinShape, shape]}>
            {pin.cover ? <Image source={{ uri: pin.cover }} style={s.pinPhoto} /> : <View style={[s.pinPhoto, { backgroundColor: c.surfaceMuted }]} />}
          </Animated.View>
          {/* 좋아요한 코스: 원의 오른쪽 위 테두리에 살짝 걸친 빨간 하트 */}
          {pin.liked && (
            <View style={[s.liked, { backgroundColor: c.surface }]}>
              <Icon name={I.heartFill} size={10} color={c.like} />
            </View>
          )}
        </Animated.View>
      </View>
    </Marker>
  );
}

type Props = {
  style?: StyleProp<ViewStyle>;
  marker?: boolean; // 내 위치 점을 띄우고, 지도가 준비되면 한 번 내 위치로 옮긴다
  follow?: boolean; // 걷는 동안 지도가 나를 따라온다
  route?: LatLng[]; // 걸은 길. 있으면 처음에 경로 전체가 보이게 맞춘다
  course?: LatLng[]; // 따라 걷는 코스. 회색으로 깔린다
  done?: LatLng[][]; // 코스 중 지나간 구간(utils/follow). 회색 위에 같은 굵기로 덮어 채워지듯 보인다
  pins?: Pin[]; // 코스 시작 위치마다 찍는 마커
  picked?: string; // 고른 마커의 id. 핀 모양으로 바뀐다
  onPick?: (id?: string) => void; // 마커를 누르면 그 id, 지도 빈 곳을 누르면 undefined
  ref?: RefObject<MapView | null>;
};

export function MapPlate({ style, marker, follow, route, course, done, pins, picked, onPick, ref }: Props) {
  const c = useTheme();
  const own = useRef<MapView>(null);
  const map = ref ?? own;
  const pinned = useRef(false); // 방금 마커를 눌렀는지
  const pressPin = (id: string) => {
    pinned.current = true;
    setTimeout(() => {
      pinned.current = false;
    }, 600);
    onPick?.(id);
  };

  return (
    <View style={[{ backgroundColor: c.surfaceMuted, overflow: "hidden" }, style]}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={START}
        showsUserLocation={marker}
        followsUserLocation={follow}
        // iOS는 마커를 눌러도 지도 눌림이 조금 뒤에 따라온다. 마커를 누른 직후의 지도 눌림은 고르기를 풀지 않는다
        onPress={() => {
          if (!pinned.current) onPick?.();
        }}
        onMapReady={() => {
          // 걸은 길이 아직 없으면(따라 걷기 시작 직후) 원래 코스 전체가 보이게 맞춘다
          const fit = route?.length ? route : course;
          if (fit?.length) map.current?.fitToCoordinates(fit, { edgePadding: PAD, animated: false });
          // 지도가 준비된 뒤 내 위치 버튼과 같은 방식으로 현재 위치를 받아 가운데로 옮긴다.
          // 지도 자체의 첫 위치 이벤트는 준비 전에 오거나, 오래된 위치거나, 권한을 막 받은 직후엔 안 오기도 한다
          else if (marker) here().then((p) => p && map.current?.animateToRegion({ ...p, ...NEAR }));
        }}
      >
        {/* 코스를 회색으로 깔고, 지나간 구간을 같은 자리에 색으로 덮는다 */}
        {course && course.length > 1 && <Polyline coordinates={course} strokeColor={c.courseDim} strokeWidth={5} lineCap="round" />}
        {done?.map((d, i) => <Polyline key={i} coordinates={d} strokeColor={c.route} strokeWidth={5} lineCap="round" />)}
        {route && route.length > 1 && <Polyline coordinates={route} strokeColor={c.route} strokeWidth={6} lineCap="round" />}
        {pins?.map((p) => p.start && <CoursePin key={p.id} pin={p} at={p.start} on={p.id === picked} onPress={() => pressPin(p.id)} />)}
      </MapView>
    </View>
  );
}

const s = StyleSheet.create({
  // 원 중심이 상자 안의 좌표 자리에 오게 놓는다
  pin: { position: "absolute", left: (PIN_BOX.width - PIN) / 2, top: PIN_UP - PIN / 2, width: PIN, height: PIN },
  // 45도 돌린 네모. 세 모서리는 둥글고 아래로 향한 한 모서리가 핀 끝이 된다
  pinShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: PIN / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
  },
  // 하트 배지 중심을 원 둘레의 오른쪽 위(45도) 지점에 둔다
  liked: {
    position: "absolute",
    left: PIN / 2 + (PIN / 2) * Math.SQRT1_2 - LIKED / 2,
    top: PIN / 2 - (PIN / 2) * Math.SQRT1_2 - LIKED / 2,
    width: LIKED,
    height: LIKED,
    borderRadius: LIKED / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // 바깥 네모가 45도 돌아가 있어 사진은 반대로 돌려 바로 세운다
  pinPhoto: { width: PIN - 8, height: PIN - 8, borderRadius: (PIN - 8) / 2, transform: [{ rotate: "-45deg" }] },
});
