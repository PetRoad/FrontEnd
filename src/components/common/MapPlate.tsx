import { useEffect, useRef, type RefObject } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import * as Location from "expo-location";
import MapView, { Polyline, type LatLng } from "react-native-maps";
import { useTheme } from "@/hooks/useTheme";

// 내 위치를 아직 모를 때 보여줄 곳: 성북구
const START = { latitude: 37.5894, longitude: 127.0167, latitudeDelta: 0.02, longitudeDelta: 0.02 };
const NEAR = { latitudeDelta: 0.008, longitudeDelta: 0.008 }; // 내 위치로 옮길 때 확대 정도
const PAD = { top: 40, right: 40, bottom: 40, left: 40 };

type Props = {
  style?: StyleProp<ViewStyle>;
  marker?: boolean; // 내 위치 점을 띄우고, 처음 한 번 내 위치로 옮긴다
  follow?: boolean; // 걷는 동안 지도가 나를 따라온다
  route?: LatLng[]; // 걸은 길. 있으면 처음에 경로 전체가 보이게 맞춘다
  course?: LatLng[]; // 따라 걷는 코스. 회색으로 깔리고, 그 위를 걸은 길이 덮으면서 채워진다
  ref?: RefObject<MapView | null>;
};

export function MapPlate({ style, marker, follow, route, course, ref }: Props) {
  const c = useTheme();
  const own = useRef<MapView>(null);
  const map = ref ?? own;
  const centered = useRef(false);

  useEffect(() => {
    if (marker) Location.requestForegroundPermissionsAsync();
  }, [marker]);

  return (
    <View style={[{ backgroundColor: c.surfaceMuted, overflow: "hidden" }, style]}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={START}
        showsUserLocation={marker}
        followsUserLocation={follow}
        onMapReady={() => {
          // 걸은 길이 아직 없으면(따라 걷기 시작 직후) 원래 코스 전체가 보이게 맞춘다
          const fit = route?.length ? route : course;
          if (fit?.length) map.current?.fitToCoordinates(fit, { edgePadding: PAD, animated: false });
        }}
        onUserLocationChange={({ nativeEvent: { coordinate: p } }) => {
          if (!p || centered.current || route?.length) return;
          centered.current = true;
          map.current?.animateToRegion({ latitude: p.latitude, longitude: p.longitude, ...NEAR });
        }}
      >
        {/* 코스를 먼저 깔고 걸은 길을 그 위에 조금 더 굵게 그린다. 코스대로 걸으면 회색이 덮여 채워지고, 벗어나면 옆으로 삐져나온다 */}
        {course && course.length > 1 && <Polyline coordinates={course} strokeColor={c.courseDim} strokeWidth={5} lineCap="round" />}
        {route && route.length > 1 && <Polyline coordinates={route} strokeColor={c.route} strokeWidth={6} lineCap="round" />}
      </MapView>
    </View>
  );
}
