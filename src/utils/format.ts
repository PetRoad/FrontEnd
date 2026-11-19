const pad = (n: number) => String(n).padStart(2, "0");

// 앱 전체 거리 표시 규칙. 1km 미만은 m, 1km 이상은 km 소수 첫째 자리까지. 둘 다 아래 자리는 버리고, 끝이 .0이면 뺀다
// 예: 90m, 431m, 1098m → 1km, 1232m → 1.2km. 0.431*1000 같은 부동소수 오차로 한 칸 내려가지 않게 아주 작은 값을 더한다
// 숫자와 단위를 다른 크기로 그리는 곳이 있어 나눠서 돌려준다
export function distanceParts(km: number) {
  const m = Math.floor(km * 1000 + 1e-6);
  if (m < 1000) return { value: String(m), unit: "m" };
  return { value: String(Math.floor(km * 10 + 1e-9) / 10), unit: "km" };
}

export const distance = (km: number) => {
  const { value, unit } = distanceParts(km);
  return value + unit;
};

// 화면 읽기(VoiceOver)용. 예: 431미터, 1.2킬로미터
export const spokenDistance = (km: number) => {
  const { value, unit } = distanceParts(km);
  return value + (unit === "m" ? "미터" : "킬로미터");
};

export const minutes = (sec: number) => `${Math.round(sec / 60)}분`;

export const clock = (sec: number) =>
  `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;

export const dotDate = (iso: string) => iso.replaceAll("-", ".");

export const monthLabel = (iso: string) => `${iso.slice(0, 4)}년 ${Number(iso.slice(5, 7))}월`;

export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayIso = () => isoDate(new Date());

export function ageFromBirth(birth: string) {
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return 0;
  const now = new Date();
  const age = now.getFullYear() - b.getFullYear();
  const hadBirthday = now >= new Date(now.getFullYear(), b.getMonth(), b.getDate());
  return Math.max(0, hadBirthday ? age : age - 1);
}
