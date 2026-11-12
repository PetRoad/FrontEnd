import { create } from "zustand";
import { queryClient } from "@/providers/QueryProvider";
import type { Dog } from "@/types/dog";

type UserState = {
  onboarded: boolean;
  email: string; // 로그인한 계정. 마이 > 계정에 보인다
  region: string;
  dog: Dog | null;
  // ponytail: 메모리에만 둔다. 앱을 다시 켜면 로그인부터. 자동 로그인을 붙일 때 refreshToken을 expo-secure-store로
  accessToken: string | null;
  refreshToken: string | null;
};

const initial: UserState = { onboarded: false, email: "", region: "", dog: null, accessToken: null, refreshToken: null };

export const useUserStore = create<UserState>()(() => initial);

// 로그아웃·세션 만료: onboarded=false → 루트 레이아웃 guard가 로그인 화면으로 보냄
// 서버에서 받아 둔 내 데이터도 비워서 다른 계정으로 로그인했을 때 앞 계정 기록이 보이지 않게 한다
export function resetUser() {
  useUserStore.setState(initial);
  queryClient.clear();
}
