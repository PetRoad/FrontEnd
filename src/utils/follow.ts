import type { LatLng } from "react-native-maps";

// 코스 따라 걷기 진행 판정.
// 코스를 STEP 간격의 점으로 잘게 나누고(화면에는 그리지 않는다), 걸은 GPS 점마다 근처의 코스 점을 지나간 것으로 표시한다.
// 지나간 두 점 사이가 채워진 구간이다. 채운 선은 코스 위의 점으로만 이어지므로 GPS가 옆으로 틀어져도 회색 선 위에 정확히 겹친다
const STEP = 2; // 코스를 나누는 간격(m)
const NEAR = 20; // GPS 점에서 이 거리 안의 코스 점을 지나간 것으로 본다. GPS 오차를 흡수하는 값이라 걸어보고 조정
const AHEAD = 100; // 지금까지 채운 지점에서 이만큼 앞까지만 찾는다. 왕복, 원형 코스에서 겹치는 뒤쪽 구간이 미리 채워지지 않게
const GAP = 50; // 직전에 지나간 점과 이만큼 안이면 사이를 이어 채운다. 반환점처럼 판정 반경(NEAR) 두 배쯤 건너뛰는 경우를 메운다. 더 멀리 건너뛰면(지름길 등) 비워 둔다

// 두 점 사이 거리를 빠르게 재려고 코스 첫 점 기준의 평면 좌표(m)로 바꾼다. 산책 범위에선 오차가 무시할 만하다
function plane(origin: LatLng) {
  const r = (6371000 * Math.PI) / 180;
  const kx = r * Math.cos((origin.latitude * Math.PI) / 180);
  return (p: LatLng) => ({ x: (p.longitude - origin.longitude) * kx, y: (p.latitude - origin.latitude) * r });
}

// done: 채운 구간들(각각 코스 위의 선), completion: 채운 길이 ÷ 코스 길이(%)
export function follow(course: LatLng[], walked: LatLng[]): { done: LatLng[][]; completion: number } {
  if (course.length < 2) return { done: [], completion: 0 };
  const xy = plane(course[0]);

  // 코스를 STEP 간격으로 나눈 점. at은 코스 시작부터 그 점까지의 거리
  const pts: LatLng[] = [];
  const xs: { x: number; y: number }[] = [];
  const at: number[] = [];
  let total = 0;
  for (let i = 0; i < course.length - 1; i++) {
    const a = course[i];
    const b = course[i + 1];
    const A = xy(a);
    const B = xy(b);
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    const n = Math.max(1, Math.ceil(len / STEP));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      pts.push({ latitude: a.latitude + (b.latitude - a.latitude) * t, longitude: a.longitude + (b.longitude - a.longitude) * t });
      xs.push({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t });
      at.push(total + len * t);
    }
    total += len;
  }
  pts.push(course[course.length - 1]);
  xs.push(xy(course[course.length - 1]));
  at.push(total);
  if (!total) return { done: [], completion: 0 };

  // from~to 사이에서 q와 가장 가까운 코스 점. NEAR 밖이면 없음
  const nearest = (q: { x: number; y: number }, from: number, to: number) => {
    let best = -1;
    let bestD = NEAR * NEAR;
    for (let j = from; j <= to; j++) {
      const d = (xs[j].x - q.x) ** 2 + (xs[j].y - q.y) ** 2;
      if (d < bestD) [best, bestD] = [j, d]; // 같은 거리면 앞쪽 점. 왕복 반환점에서 돌아올 길로 먼저 넘어가지 않게
    }
    return best;
  };

  const hit = new Array<boolean>(pts.length).fill(false);
  let last = -1; // 마지막으로 지나간 코스 점. 이보다 뒤로는 돌아가지 않는다
  for (const p of walked) {
    const q = xy(p);
    const from = Math.max(last, 0);
    let end = from;
    while (end < pts.length - 1 && at[end + 1] - at[from] <= AHEAD) end++;
    // 앞 100m에서 못 찾으면(코스를 벗어났다 돌아온 경우) 남은 코스 전체에서 찾는다
    // ponytail: 코스를 벗어나 있는 동안은 GPS 점마다 남은 코스 점을 다 훑는다. 수 km 코스까진 괜찮고, 느려지면 격자로 나눠 찾는다
    let j = nearest(q, from, end);
    if (j < 0) j = nearest(q, end + 1, pts.length - 1);
    if (j < 0) continue;
    if (last >= 0 && at[j] - at[last] <= GAP) hit.fill(true, last, j + 1);
    else hit[j] = true;
    last = j;
  }

  // 양 끝이 모두 지나간 칸만 채운다. 이어진 칸은 한 선으로 묶는다
  const done: LatLng[][] = [];
  let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    if (!hit[i] || !hit[i + 1]) continue;
    len += at[i + 1] - at[i];
    if (i > 0 && hit[i - 1]) done[done.length - 1].push(pts[i + 1]);
    else done.push([pts[i], pts[i + 1]]);
  }
  return { done, completion: Math.min(100, Math.round((len / total) * 100)) };
}
