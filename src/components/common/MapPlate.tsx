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
  ref?: RefObject<MapView | null>;
};

export function MapPlate({ style, marker, follow, route, ref }: Props) {
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
          if (route?.length) map.current?.fitToCoordinates(route, { edgePadding: PAD, animated: false });
        }}
        onUserLocationChange={({ nativeEvent: { coordinate: p } }) => {
          if (!p || centered.current || route?.length) return;
          centered.current = true;
          map.current?.animateToRegion({ latitude: p.latitude, longitude: p.longitude, ...NEAR });
        }}
      >
        {route && route.length > 1 && <Polyline coordinates={route} strokeColor={c.route} strokeWidth={5} />}
      </MapView>
    </View>
  );
}
