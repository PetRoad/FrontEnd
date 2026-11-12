const pad = (n: number) => String(n).padStart(2, "0");

// 소수 한 자리에서 버림. 483m → 0.4km. 0.3*10 같은 부동소수 오차로 한 칸 내려가지 않게 아주 작은 값을 더한다
export const floorKm = (n: number) => (Math.floor(n * 10 + 1e-9) / 10).toFixed(1);

export const km = (n: number) => `${floorKm(n)}km`;

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
