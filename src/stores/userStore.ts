import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { queryClient } from "@/providers/QueryProvider";
import type { Dog } from "@/types/dog";

type UserState = {
  onboarded: boolean;
  email: string; // 로그인한 계정. 마이 > 계정에 보인다
  region: string;
  dog: Dog | null;
  // 액세스 토큰은 메모리에만 둔다. 리프레시 토큰은 자동 로그인을 위해 키체인에도 남긴다(아래 subscribe)
  accessToken: string | null;
  refreshToken: string | null;
};

const initial: UserState = { onboarded: false, email: "", region: "", dog: null, accessToken: null, refreshToken: null };

export const useUserStore = create<UserState>()(() => initial);

// 자동 로그인: 리프레시 토큰과 이메일을 키체인에 둔다.
// 토큰이 바뀔 때마다(로그인, 재발급, 로그아웃, 세션 만료) 따라서 저장하거나 지운다. 화면이 잠긴 채 재발급돼도 써지도록 첫 잠금 해제 뒤부터 접근 허용
const SESSION = "session";
useUserStore.subscribe((s, prev) => {
  if (s.refreshToken === prev.refreshToken) return;
  const saving = s.refreshToken
    ? SecureStore.setItemAsync(SESSION, JSON.stringify({ email: s.email, refreshToken: s.refreshToken }), {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      })
    : SecureStore.deleteItemAsync(SESSION);
  saving.catch(() => {}); // 못 쓰면 다음 실행 때 로그인부터 할 뿐이다
});

export const savedSession = async () => {
  const saved = await SecureStore.getItemAsync(SESSION);
  return saved ? (JSON.parse(saved) as { email: string; refreshToken: string }) : null;
};

// 로그아웃·세션 만료: onboarded=false → 루트 레이아웃 guard가 로그인 화면으로 보냄
// 서버에서 받아 둔 내 데이터도 비워서 다른 계정으로 로그인했을 때 앞 계정 기록이 보이지 않게 한다
export function resetUser() {
  useUserStore.setState(initial);
  queryClient.clear();
}
