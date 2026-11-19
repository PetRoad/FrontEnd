import { AppState } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useWalkStore } from "@/stores/walkStore";

// EAS 업데이트를 바로 적용한다. 기본 동작은 켤 때 받아 두고 그다음에 켤 때 적용이라 두 번 껐다 켜야 했다.
// 앱을 켤 때와 백그라운드에서 돌아올 때마다 확인하고, 새 업데이트가 있으면 받아서 바로 다시 불러온다.
// 산책 중이거나 저장 전 결과가 남아 있으면 다시 부르지 않는다(기록이 메모리에만 있다). 받아 둔 것은 산책을 마친 뒤 다음에 앞으로 나올 때 적용된다
async function apply() {
  try {
    if (!(await Updates.checkForUpdateAsync()).isAvailable) return;
    await Updates.fetchUpdateAsync();
    if (!useWalkStore.getState().current) await Updates.reloadAsync();
  } catch {
    // 연결이 없거나 서버 오류면 다음에 앞으로 나올 때 다시 확인한다
  }
}

// Expo Go와 개발 서버에서는 업데이트를 쓰지 않는다(위 함수들이 거절한다)
if (!__DEV__ && Updates.isEnabled) {
  apply();
  AppState.addEventListener("change", (s) => {
    if (s === "active") apply();
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

// 마이 맨 아래에 보이는 지금 실행 중인 버전. 예: 버전 1.0.0 (11.19 16:30 업데이트)
// 빌드에 들어 있던 코드로 실행 중이면 버전만, Expo Go나 개발 서버면 개발 중
export function versionLabel() {
  const v = `버전 ${Constants.expoConfig?.version ?? ""}`;
  if (__DEV__ || !Updates.isEnabled) return `${v} (개발 중)`;
  const d = Updates.createdAt;
  if (Updates.isEmbeddedLaunch || !d) return v;
  return `${v} (${d.getMonth() + 1}.${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())} 업데이트)`;
}
