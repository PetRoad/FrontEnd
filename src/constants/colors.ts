// 햇살 아래 산책: 아이보리 바탕(#FEFFFA), 햇살 노랑 포인트(#FFD374).
// 글자는 순수 검정 대신 따뜻한 짙은 회갈색으로 무게를 뺀다
export const palette = {
  ground: "#FEFFFA",
  surface: "#FFFFFF",
  fill: "#F4F2EA",
  ink: "#3D3A35",
  inkMuted: "#6E695F",
  hairline: "#ECE9E0",
  accent: "#FFD374",
  onAccent: "#3D3A35",
  accentSoft: "#FFF3D6", // 수치 패널, 추천코스 시트
  tint: "#9A6412", // 링크·선택 상태. 바탕 위 대비 4.5:1 이상
  tile: "#F2EFE6",
  mapTone: "#F4F2EA",
  mapRoad: "#FFFFFF",
  water: "#E3EEF2",
};

export type Palette = typeof palette;
