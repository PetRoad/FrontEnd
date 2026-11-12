import { File } from "expo-file-system";
import { resetUser, useUserStore } from "@/stores/userStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// 서버 에러는 항상 { message }. retryAfter: 429 로그인 제한이 풀리기까지 남은 초
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

// 서버가 준 메시지 / 요청이 나가지 못했으면 연결 안내(expo/fetch는 "fetch failed: …", RN fetch는 TypeError) / 그 밖은 앱 버그라 로그로 남긴다
export function errorMessage(e: unknown) {
  if (e instanceof ApiError) return e.message;
  if (e instanceof TypeError || (e instanceof Error && e.message.startsWith("fetch failed"))) {
    return "인터넷 연결을 확인하고 다시 시도해주세요.";
  }
  console.error(e);
  return "잠시 후 다시 시도해주세요.";
}

type Options = { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown };

export async function api<T>(path: string, { method = "GET", body }: Options = {}, retry = true): Promise<T> {
  const token = useUserStore.getState().accessToken;
  const form = body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined && !form && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: form ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  // 액세스 토큰은 15분이면 만료된다. 한 번 재발급하고 같은 요청을 다시 보낸다
  if (response.status === 401 && retry && token && (await refresh())) return api(path, { method, body }, false);

  if (!response.ok) {
    const { message } = await response.json().catch(() => ({}));
    const retryAfter = Number(response.headers.get("Retry-After")) || undefined;
    throw new ApiError(message ?? "잠시 후 다시 시도해주세요.", response.status, retryAfter);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

// 리프레시 토큰은 쓰면 새 값으로 바뀌고, 쓴 토큰을 다시 쓰면 서버가 세션을 폐기한다.
// 그래서 동시에 401이 여러 개 나도 재발급은 한 번만 하고 모두 그 결과를 기다린다
let refreshing: Promise<boolean> | null = null;

function refresh() {
  refreshing ??= (async () => {
    const { refreshToken } = useUserStore.getState();
    if (!refreshToken) return false;
    try {
      const t = await api<{ accessToken: string; refreshToken: string }>("/api/auth/refresh", { method: "POST", body: { refreshToken } }, false);
      // 기다리는 사이 로그아웃했으면 새 토큰을 되살리지 않는다
      if (useUserStore.getState().refreshToken !== refreshToken) return false;
      useUserStore.setState({ accessToken: t.accessToken, refreshToken: t.refreshToken });
      return true;
    } catch (e) {
      // 리프레시 토큰이 만료·폐기(400·401)됐을 때만 로그인부터 다시. 연결 문제나 서버 오류(5xx)면 세션은 그대로 둔다
      if (e instanceof ApiError && (e.status === 400 || e.status === 401)) resetUser();
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

// SDK 58의 fetch(expo/fetch)는 RN식 { uri, name, type }를 받지 않는다. Blob을 구현한 expo-file-system File로 보낸다
// ponytail: 웹은 앨범 사진이 blob uri라 안 올라간다. 웹을 지원할 때 picker의 asset.file을 넘기도록
export async function upload(uri: string, purpose: "DOG_PROFILE" | "WALK_PHOTO" | "COURSE_COVER") {
  const form = new FormData();
  form.append("file", new File(uri));
  const { url } = await api<{ url: string }>(`/api/uploads?purpose=${purpose}`, { method: "POST", body: form });
  return url;
}
