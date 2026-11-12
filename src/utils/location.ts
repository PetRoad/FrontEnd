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

// 좌표의 동네 이름. 예: 서울특별시 성북구 정릉동. 나라마다 칸이 겹쳐 오기도 해서 중복은 뺀다. 못 찾으면 null
export async function placeName(p: LatLng) {
  const [a] = await Location.reverseGeocodeAsync(p).catch(() => []);
  return a ? [...new Set([a.region, a.city, a.district].filter(Boolean))].join(" ") : null;
}
