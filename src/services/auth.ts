import { api, refresh } from "@/services/api";
import { toDog, type ApiDog } from "@/services/user";
import { resetUser, savedSession, useUserStore } from "@/stores/userStore";

type TokenPair = { accessToken: string; refreshToken: string; userId: number };
type Overview = { region?: string | null; dog?: ApiDog | null };

// 서버는 이메일 대소문자를 구분한다. Kong@…로 가입하고 kong@…으로 로그인해도 같은 계정이 되도록 소문자로 보낸다
const normalize = (email: string) => email.trim().toLowerCase();

// 가입은 토큰을 주지 않는다. 가입 뒤 login을 이어서 부른다
export const signup = (email: string, password: string) =>
  api<{ userId: number; email: string }>("/api/auth/signup", { method: "POST", body: { email: normalize(email), password } });

// 토큰을 받고 동네·반려견을 불러온다. 둘 다 있으면 onboarded=true → 루트 레이아웃 guard가 산책 홈으로 보냄
export async function login(rawEmail: string, password: string) {
  const email = normalize(rawEmail);
  const t = await api<TokenPair>("/api/auth/login", { method: "POST", body: { email, password } });
  useUserStore.setState({ email, accessToken: t.accessToken, refreshToken: t.refreshToken });
  // 내 정보를 못 받으면 방금 연 세션을 닫는다. 다시 누르면 처음부터 로그인
  return loadMe().catch(async (e) => {
    await logout();
    throw e;
  });
}

async function loadMe() {
  const me = await api<Overview>("/api/me");
  const region = me.region ?? "";
  const dog = me.dog ? toDog(me.dog) : null;
  useUserStore.setState({ region, dog, onboarded: Boolean(region && dog) });
  return { region, dog };
}

// 자동 로그인: 앱을 켤 때 키체인에 남은 리프레시 토큰으로 재발급받고 내 정보를 불러온다. 온보딩까지 마친 계정이면 바로 산책 홈
// 토큰이 만료·폐기됐으면 refresh가 세션을 비우고(키체인도 지워짐) 로그인 화면. 연결 문제면 토큰은 남겨 두고 다음 실행 때 다시 시도
export async function restore() {
  const saved = await savedSession();
  if (!saved) return;
  useUserStore.setState(saved);
  if (await refresh()) await loadMe();
}

// 비밀번호를 확인한 뒤 계정과 내 데이터를 지운다. 틀리면 400이라 토큰 재발급과 섞이지 않는다
export async function withdraw(password: string) {
  await api("/api/me", { method: "DELETE", body: { password } });
  resetUser();
}

// 화면은 바로 로그인으로. 서버 세션 폐기는 실패해도 막지 않는다(리프레시 토큰은 만료되면 어차피 못 쓴다)
export async function logout() {
  const { refreshToken } = useUserStore.getState();
  resetUser();
  if (refreshToken) await api("/api/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {});
}
