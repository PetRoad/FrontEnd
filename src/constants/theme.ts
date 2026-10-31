import type { TextStyle } from "react-native";

// PetRoad = Warm Minimal + Subtle Glass. 색·글자·간격·모서리·그림자는 모두 여기서만 가져온다
export const palette = {
  primary: "#FFD374", // Chew Yellow: 주 버튼, 선택 상태. 글자색으로 쓰지 않는다
  primaryPressed: "#F2BE4E", // 주 버튼 눌림
  onPrimary: "#232323",
  primarySoft: "#FFF3D6", // Cream Beige: 보조 버튼, 강조 카드, 중요한 태그
  primarySoftPressed: "#FFE7B0", // 보조 버튼 눌림
  primaryDeep: "#8C5A00", // Chew Brown: Cream Beige 위 글자, 입력칸 포커스. 노랑 계열에서 글자로 쓰는 유일한 색 (흰 바탕 5.9:1, Cream Beige 5.3:1)
  background: "#FEFFFA", // Tese White: 화면 바탕, 바텀시트
  surface: "#FFFFFF", // 카드, 그룹 목록, 탭바
  surfaceMuted: "#F5F5F5", // 입력칸, 보조 버튼, 사진 자리, 세그먼트 트랙
  textPrimary: "#232323", // Hunt Black: 본문, 제목, 아이콘
  textSecondary: "#616160", // 보조 정보, 라벨
  textTertiary: "#ADADAD", // 비활성 탭, 화살표, 손잡이
  borderStrong: "#CCCCCC",
  borderSubtle: "#EFEFEF",
  error: "#D93636", // 입력 오류. 흰 바탕 대비 4.5:1 이상
  route: "#9A6412", // 지도 위 내가 걸은 길. 코스(노랑)와 구분되도록 기존 색 유지
  mapWater: "#E3EEF2", // 웹 지도 자리 전용
};

export type Palette = typeof palette;

// Pretendard 정적 굵기 4개 (assets/fonts, SIL OFL 1.1)
export const font = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  semibold: "Pretendard-SemiBold",
  bold: "Pretendard-Bold",
} as const;

export type Weight = keyof typeof font;

// 굵기는 fontWeight가 아니라 fontFamily로 고른다: 커스텀 폰트에 fontWeight를 주면 플랫폼마다 다르게 합성된다
// 자간은 제목 약 -2%, 본문 약 -1%
export const typography = {
  titleXL: { fontFamily: font.bold, fontSize: 34, lineHeight: 44, letterSpacing: -0.7 },
  titleLG: { fontFamily: font.bold, fontSize: 28, lineHeight: 36, letterSpacing: -0.6 },
  heading: { fontFamily: font.semibold, fontSize: 22, lineHeight: 30, letterSpacing: -0.4 },
  bodyStrong: { fontFamily: font.bold, fontSize: 19, lineHeight: 26, letterSpacing: -0.2 },
  bodyMain: { fontFamily: font.semibold, fontSize: 18, lineHeight: 26, letterSpacing: -0.2 },
  body: { fontFamily: font.regular, fontSize: 16, lineHeight: 24, letterSpacing: -0.2 },
  bodySmall: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, letterSpacing: -0.1 },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
} satisfies Record<string, TextStyle>;

// 4pt 단위
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;

export const gutter = space.xl; // 화면 좌우 여백
export const mapEdge = space.lg; // 지도 위에 떠 있는 요소와 화면 가장자리 사이

export const radius = {
  chip: 8,
  thumb: 12, // 목록 썸네일, 사진 그리드
  input: 14,
  button: 16,
  image: 16, // 카드 안 커버 (카드 20 - 안쪽 여백 4)
  card: 20,
  cardLg: 24,
  sheet: 24,
  pill: 999,
} as const;

// 그림자는 두 단계뿐. 테두리·바탕색으로 구분되는 면에는 쓰지 않는다
export const shadow = {
  subtle: { boxShadow: "0 4px 12px rgba(35, 35, 35, 0.06)" }, // 선택된 세그먼트 등 작은 요소
  float: { boxShadow: "0 8px 24px rgba(35, 35, 35, 0.08)" }, // 지도 위 떠 있는 패널·버튼
};

// 지도 위 오버레이 전용 유리 면
export const glass = {
  bg: "rgba(255, 255, 255, 0.72)",
  bgSolid: "rgba(255, 255, 255, 0.94)", // 블러가 없는 안드로이드·웹: 지도 글자가 비쳐 읽기 어렵지 않게
  border: "rgba(255, 255, 255, 0.5)",
  blur: 20,
};
