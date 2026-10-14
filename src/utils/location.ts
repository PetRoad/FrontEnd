import * as Location from "expo-location";
import type { LatLng } from "react-native-maps";

// 현재 위치. 권한이 없거나 위치 서비스가 꺼져 있으면 null
export async function here(): Promise<LatLng | null> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) return null;
  return Location.getCurrentPositionAsync().then(
    ({ coords }) => ({ latitude: coords.latitude, longitude: coords.longitude }),
    () => null,
  );
}

// 두 좌표 사이 거리(m). 하버사인
export function meters(a: LatLng, b: LatLng) {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLng = (b.longitude - a.longitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}
