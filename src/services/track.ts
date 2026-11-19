import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useWalkStore } from "@/stores/walkStore";

// 산책 경로 기록. 화면이 꺼지거나 다른 앱으로 넘어가도 iOS가 위치를 이 작업으로 계속 보낸다
const TASK = "walk-location";
// ponytail: GPS 튐은 이 두 값으로만 거른다. 실제로 걸어보고 거리가 부풀면 값을 조정하고, 그래도 안 되면 필터를 붙인다
const MIN_STEP_M = 5; // 이만큼 움직여야 새 점을 받는다
const MAX_ERROR_M = 30; // 오차가 이보다 큰 점은 버린다

const take = ({ coords }: Location.LocationObject) => {
  if (coords.accuracy != null && coords.accuracy > MAX_ERROR_M) return;
  useWalkStore.getState().move({ latitude: coords.latitude, longitude: coords.longitude });
};

// 앱이 백그라운드에서 켜질 때는 화면이 하나도 없으니, 컴포넌트 밖에서 모듈을 불러올 때 등록한다(루트 레이아웃이 불러옴)
TaskManager.defineTask<{ locations: Location.LocationObject[] }>(TASK, async ({ data, error }) => {
  if (!error && data) data.locations.forEach(take);
});

// 산책 기록은 메모리에만 있어 앱이 새로 켜지면 진행 중인 산책이 없다. 지난번에 멈추지 못한 위치 업데이트가 남아 있으면 끈다
// (위치 업데이트 등록은 앱을 꺼도 남아 있고, iOS가 큰 위치 변화로 앱을 다시 깨우기도 한다)
Location.hasStartedLocationUpdatesAsync(TASK)
  .then((on) => (on ? Location.stopLocationUpdatesAsync(TASK) : undefined))
  .catch(() => {});

// 산책 시작. 위치 권한(앱을 사용하는 동안)은 미리 받아 둔다. 돌려준 함수를 부르면 멈춘다
// 앞에서 시작하므로 '항상 허용' 없이도 백그라운드에서 계속 받는다. 그동안 상태 막대에 파란 위치 표시가 뜬다
// Expo Go는 백그라운드 위치를 지원하지 않아 실패한다. 그때는 앞에 있을 때만 받고 화면이 꺼지지 않게 켜 둔다
export async function startTracking(): Promise<() => void> {
  try {
    await Location.startLocationUpdatesAsync(TASK, {
      accuracy: Location.Accuracy.High,
      distanceInterval: MIN_STEP_M,
      activityType: Location.ActivityType.Fitness,
      pausesUpdatesAutomatically: false, // 신호를 기다리며 잠깐 서 있어도 끊기지 않게
      showsBackgroundLocationIndicator: true,
    });
    return () => {
      Location.stopLocationUpdatesAsync(TASK).catch(() => {});
    };
  } catch {
    await activateKeepAwakeAsync(TASK);
    const sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: MIN_STEP_M }, take);
    return () => {
      sub.remove();
      deactivateKeepAwake(TASK);
    };
  }
}
