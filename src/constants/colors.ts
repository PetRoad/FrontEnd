// 천변 노면 표시: 우레탄 트랙 초록 면, 노면 노랑 판, 아스팔트 잉크, 보도 콘크리트 바탕
const road = {
  track: "#1F5C45",
  onTrack: "#FFFFFF",
  onTrackMuted: "#BFD6CB",
  paint: "#FFC61A",
  onPaint: "#151716",
};

export const palettes = {
  light: {
    ...road,
    ground: "#ECEEEA",
    surface: "#FFFFFF",
    raised: "#FFFFFF", // 지도 위 떠 있는 요소, 세그먼트 선택 칸
    fill: "#E0E4DE",
    ink: "#151716",
    inkMuted: "#545B57",
    hairline: "#D3D8D2",
    tint: "#1F5C45",
    tile: "#DADFD8",
    mapTone: "#E4E8E0",
    mapRoad: "#F7F8F5",
    stream: "#C9DDD2",
  },
  dark: {
    ...road,
    ground: "#0E1110",
    surface: "#191D1B",
    raised: "#333A36", // fill·mapTone보다 밝아야 다크 지도 위에서 가장자리가 보인다
    fill: "#242926",
    ink: "#EDF0EC",
    inkMuted: "#9BA39E",
    hairline: "#2B312E",
    tint: "#6CC79F",
    tile: "#232926",
    mapTone: "#171B19",
    mapRoad: "#222825",
    stream: "#1D3329",
  },
};

export type Palette = typeof palettes.light;
