---
name: PetRoad
description: 반려견과 걸은 길과 순간을 기록하고, 우리 동네의 좋은 산책길을 발견하는 iOS 앱
colors:
  primary: "#FFD374"
  primary-pressed: "#F2BE4E"
  on-primary: "#232323"
  primary-soft: "#FFF3D6"
  primary-soft-pressed: "#FFE7B0"
  primary-deep: "#8C5A00"
  background: "#FEFFFA"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F5"
  text-primary: "#232323"
  text-secondary: "#616160"
  text-tertiary: "#ADADAD"
  border-strong: "#CCCCCC"
  border-subtle: "#EFEFEF"
  error: "#D93636"
  route: "#9A6412"
  map-water: "#E3EEF2"
typography:
  title-xl:
    fontFamily: "Pretendard-Bold"
    fontSize: "34px"
    lineHeight: "44px"
    letterSpacing: "-0.7px"
  title-lg:
    fontFamily: "Pretendard-Bold"
    fontSize: "28px"
    lineHeight: "36px"
    letterSpacing: "-0.6px"
  heading:
    fontFamily: "Pretendard-SemiBold"
    fontSize: "22px"
    lineHeight: "30px"
    letterSpacing: "-0.4px"
  body-strong:
    fontFamily: "Pretendard-Bold"
    fontSize: "19px"
    lineHeight: "26px"
    letterSpacing: "-0.2px"
  body-main:
    fontFamily: "Pretendard-SemiBold"
    fontSize: "18px"
    lineHeight: "26px"
    letterSpacing: "-0.2px"
  body:
    fontFamily: "Pretendard-Regular"
    fontSize: "16px"
    lineHeight: "24px"
    letterSpacing: "-0.2px"
  body-small:
    fontFamily: "Pretendard-Regular"
    fontSize: "14px"
    lineHeight: "20px"
    letterSpacing: "-0.1px"
  caption:
    fontFamily: "Pretendard-Regular"
    fontSize: "12px"
    lineHeight: "16px"
  numeral:
    fontFamily: "Pretendard-SemiBold / Pretendard-Bold"
    fontFeature: "tnum"
rounded:
  chip: "8px"
  thumb: "12px"
  input: "14px"
  button: "16px"
  image: "16px"
  card: "20px"
  card-lg: "24px"
  sheet: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  xxxl: "32px"
  huge: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-main}"
    rounded: "{rounded.button}"
    height: "56px"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-secondary:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.body-main}"
    rounded: "{rounded.button}"
    height: "52px"
  button-secondary-pressed:
    backgroundColor: "{colors.primary-soft-pressed}"
  button-disabled:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.surface}"
  button-plain:
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    height: "44px"
  chip:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.chip}"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  tag:
    backgroundColor: "{colors.surface-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    height: "24px"
  tag-soft:
    backgroundColor: "{colors.primary-soft}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.input}"
    height: "52px"
  course-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "4px"
  stat-band:
    backgroundColor: "{colors.primary-soft}"
    rounded: "{rounded.card-lg}"
    padding: "20px"
  glass:
    backgroundColor: "rgba(255, 255, 255, 0.72)"
    border: "1px solid rgba(255, 255, 255, 0.5)"
    blur: "20"
---

# Design System: PetRoad

## Overview

**PetRoad = Warm Minimal + Subtle Glass.**

화면 전체는 장식을 덜어낸 따뜻한 미니멀(Tese White 바탕, Hunt Black 글자, Pretendard), 지도 위에 떠 있는 몇 개의 요소만 옅은 유리(Glass)다. 한 손에 리드줄을 쥔 채 야외에서 짧게 보는 화면이라 대비는 높게, 행동은 엄지 자리의 큰 버튼 하나로 모은다.

화면마다 정보 계층이 다르다.
- 산책 홈: 지도 중심 탐색. 위에는 유리 동네 알약과 내 위치 버튼, 아래에는 Tese White 추천 코스 시트.
- 산책 진행: 실시간 수치와 조작. 위에 Chew Yellow 한 줄 바(코스명과 수치), 아래에 원형 카메라 버튼과 종료 버튼.
- 코스 상세: 콘텐츠와 정보. 커버, 코스명, 거리·난이도, 반려견, 경로.
- 마이: 개인 데이터 정리. 큰 프로필 카드 + 함께 걸은 기록 두 칸 + 메뉴 묶음.
- 로그인·온보딩: 입력과 진행. 넓은 여백, 채운 입력칸, 하단 주 버튼.

모든 값은 `src/constants/theme.ts` 하나에서 나온다. 화면 코드에 hex를 쓰지 않는다. 앱은 라이트 모드 하나만 쓴다(app.json `userInterfaceStyle: light`).

## Colors

### Brand
- **Chew Yellow** (primary `#FFD374`): 주 버튼, 선택된 칩, 단계 바 채움, 사진 수 배지, 산책 진행 바, 산책 결과 통계 카드. 글자색으로 쓰지 않는다. 눌림은 primaryPressed `#F2BE4E`.
- **Cream Beige** (primarySoft `#FFF3D6`): 보조 버튼, 통계 카드(일지 상세), 난이도 태그, 좋아요 켜진 버튼, 마이 아바타. 눌림은 primarySoftPressed `#FFE7B0`.
- **Chew Brown** (primaryDeep `#8C5A00`): Cream Beige 위 글자와 아이콘(보조 버튼, 좋아요 켜짐), 입력칸 포커스 테두리. 노랑 계열에서 글자로 쓰는 유일한 색(흰 바탕 5.9:1, Cream Beige 5.3:1).
- **Tese White** (background `#FEFFFA`): 모든 화면, 스택 헤더, 하단 고정 영역, 추천 코스 시트.
- **Hunt Black** (textPrimary `#232323`): 본문, 제목, 아이콘, 선택·커서 색. Chew Yellow 위 글자(onPrimary)도 같은 값.

### Neutral
- textSecondary `#616160`: 보조 정보, 라벨, 단위, 플레이스홀더.
- textTertiary `#ADADAD`: 비활성 탭, 화살표, 사진 자리 아이콘.
- borderStrong `#CCCCCC`: 시트 손잡이, 통계 카드 안 구분선.
- borderSubtle `#EFEFEF`: 카드·그룹 테두리, 행 구분선, 탭바 위 선.
- surfaceMuted `#F5F5F5`: 수정할 수 없는 입력칸, 칩·태그, 좋아요 꺼진 버튼, 사진 자리, 세그먼트 트랙.
- surface `#FFFFFF`: 카드, 그룹 목록, 탭바, 포커스된 입력칸.

### 기능 색
- error `#D93636`: 입력 오류 테두리와 문구.
- route `#9A6412`: 지도 위 내가 걸은 길(두께 5). 원래 코스(노랑)와 구분되도록 기존 색을 유지한다. 지도 밖 UI에는 쓰지 않는다.
- mapWater `#E3EEF2`: 웹 지도 자리 전용.

### Named Rules
**The One Sun Rule.** Chew Yellow 면은 한 화면의 주 행동 하나와 상태 표시에만. 넓은 강조 면이 필요하면 Cream Beige.

**The No Green Rule.** 초록 계열(Foxtail Green, Bean Green)과 Jelly Orange는 쓰지 않는다.

**The Route Rule.** 지도 위 경로는 브랜드 노랑으로 통일하지 않는다. 원래 코스는 노랑 점선, 내가 걸은 길은 route 실선.

## Typography

**Pretendard** 하나 (`assets/fonts`, Regular·Medium·SemiBold·Bold, SIL OFL 1.1). Expo Go에서 쓰기 위해 `useFonts`로 실행 중에 불러온다. 굵기는 `fontWeight`가 아니라 `fontFamily`로 고른다.

| 단계 | 크기/행간 | 굵기 | 쓰임 |
|---|---|---|---|
| titleXL | 34/44 | Bold | 마이 제목, 로그인 서비스명 |
| titleLG | 28/36 | Bold | 화면 제목(오늘도 잘 걸었어요, 코스명, 온보딩 질문, 일지 날짜) |
| heading | 22/30 | SemiBold | 시트 제목, 반려견 이름 |
| bodyStrong | 19/26 | Bold | 강조 문장 |
| bodyMain | 18/26 | SemiBold | 섹션 제목, 카드 코스명, 버튼 |
| body | 16/24 | Regular | 행 제목, 입력, 설명 |
| bodySmall | 14/20 | Regular | 보조 정보, 수치 라벨, 입력 라벨(Medium) |
| caption | 12/16 | Regular | 태그(Medium), 범례, 사진 자리 |

자간은 제목 약 -2%, 본문 약 -1%.

**The Steady Digits Rule.** 거리·시간·개수는 `Num`(SemiBold/Bold + `tabular-nums`)으로 쓴다. 걷는 중 값이 바뀌어도 자리가 흔들리지 않는다. 28 이상은 자간 -2%.

**The Labeled Number Rule.** 큰 수치 아래에는 bodySmall 라벨, 단위는 수치의 약 0.45배 textSecondary.

## Layout

- 4pt 단위: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40.
- 화면 좌우 여백 20(`gutter`), 지도 위 떠 있는 요소는 가장자리 16(`mapEdge`).
- 섹션 간격 24, 섹션 안 제목–내용 12, 카드 간격 12, 카드 안쪽 16~20.
- 누를 수 있는 것은 최소 44×44.
- 주 행동과 되돌릴 수 없는 행동은 하단 고정 영역(`BottomBar`: Tese White, 위쪽 실선, 안전영역 + 12, 버튼 간격 12).
- 제목·정보는 왼쪽 정렬. 가운데 정렬은 로그인 브랜드 블록과 빈 상태에만.

산책 홈 시트는 세 단계로 멈춘다: 닫힘(손잡이·제목·부제 91), 반(가로 코스 카드 한 줄, 카드 폭 232), 전체(화면의 75%). 처음엔 닫힘. 산책 시작 버튼은 시트 바로 위를 따라다닌다. 코스 카드나 시트 머리 높이를 바꾸면 `MIN`/`PEEK` 상수도 맞춘다.

## Shapes

칩·태그 8, 썸네일·사진 그리드 12, 입력칸 14, 버튼 16, 카드 안 커버 16, 카드 20, 큰 카드(프로필·결과 통계) 24, 바텀시트 상단 24. 원: 아바타, 지도 위 원형 버튼, 배지. 알약: 지도 위 동네 표시.

코스 카드와 앨범 패널은 안쪽 여백 4 안에 반경 16 커버를 넣어 바깥 20과 동심원이 되게 한다.

## Elevation & Depth

기본은 평면이다. 바탕 → 흰 카드 → 테두리로 층을 나누고, 그림자는 두 단계뿐이다.
- **Level 1 subtle** `0 4px 12px rgba(35,35,35,0.06)`: 선택된 세그먼트 칸, 웹 지도 내 위치 점.
- **Level 2 float** `0 8px 24px rgba(35,35,35,0.08)`: 지도 위 유리 요소, 산책 시작 버튼, 추천 코스 시트.

카드·그룹·통계 카드에는 그림자를 주지 않는다.

## Glass

지도 위 오버레이에만 쓴다: 산책 홈 동네 알약·내 위치 버튼, 산책 진행 카메라 버튼·범례.
- 바탕 `rgba(255,255,255,0.72)`, 테두리 1px `rgba(255,255,255,0.5)`, 블러 20(`expo-blur`, tint light), Level 2 그림자.
- iOS만 실제 블러. 안드로이드는 `BlurTargetView` 없이 블러가 되지 않아 바탕을 0.94로 올려 가독성을 지킨다(웹도 같음).
- 유리 버튼의 눌림은 투명도 대신 크기(0.94)로 보여준다. 블러 뷰의 투명도를 바꾸면 효과가 깨진다.
- 금지: 코스 카드, 긴 텍스트, 입력칸, 마이 카드, 산책일지, 앨범.

## Components

### Buttons (`Btn`, `Plate`)
- **primary (`Plate`)**: Chew Yellow, Hunt Black bodyMain, 높이 56, 반경 16, 선택 아이콘 20. 화면당 하나.
- **secondary**: Cream Beige 틴트, Chew Brown 글자, 높이 52. 주 버튼 옆에 나란히 둘 때도 같은 모양.
- **plain**: 투명, textSecondary body Medium, 높이 44. 가장 약한 행동(기록 버리기).
- 상태: 눌림은 투명도 대신 한 단계 진한 면(primary → primaryPressed, secondary → primarySoftPressed, plain → surfaceMuted). 비활성은 borderStrong 바탕 + 흰 글자. 로딩은 아이콘 자리에 스피너 + 누를 수 없음.

### Inputs (`Field`, `BigField`, `PasswordField`)
- 흰 칸 + borderStrong 1px 테두리, 반경 14, 최소 높이 52(로그인 56). 위에 bodySmall Medium 라벨.
- 포커스: Chew Brown 테두리. 수정할 수 없는 칸: surfaceMuted 채움. 오류(`error`): error 테두리 + 아래 caption 문구.
- 플레이스홀더는 textSecondary(야외 가독성).

### Chips & Tags
- **Chip**: 고를 수 있는 칩. 높이 40, 반경 8, surfaceMuted → 선택 시 Chew Yellow + SemiBold.
- **Tag**: 읽기 전용. 높이 24, 반경 8, caption Medium. 난이도만 `soft`(Cream Beige), 나머지 특징 태그는 surfaceMuted.

### Cards
- **CourseCard**: 흰 면, borderSubtle 1px, 반경 20, 안쪽 4. 커버(가로 카드 112 / 세로 160, 반경 16) / 코스명 bodyMain / 거리 Num + 난이도 Tag + 좋아요 / 견종·나이 bodySmall. 그림자 없음.
- **통계 카드**: 반경 24(결과) / 20(일지 상세), 안쪽 20. 산책 결과는 Chew Yellow 면에 단위, 라벨, 구분선 모두 Hunt Black(회색은 노랑 위 대비 부족), 일지 상세는 Cream Beige.
- **Group / Row**: 흰 면, 반경 20, 행 최소 높이 56, 좌측 16 들여 쓴 구분선, 아이콘 20 Hunt Black, 화살표 textTertiary.

### Map overlay (`Glass`, `FloatButton`)
- FloatButton: 원형 유리 버튼(기본 48, 산책 진행 카메라 56), 아이콘은 지름의 0.42. 사진 수는 Chew Yellow 배지.
- 산책 진행 바: Chew Yellow 상태 표시 면, Level 2 그림자, 높이 52, 반경 16, 좌우 안쪽 20, 글자 Hunt Black. 왼쪽 코스명(자유산책은 "자유산책"), 오른쪽 수치 두 개를 옅은 세로선으로 나눈다. 따라 걷기는 걸은 거리(Medium) | 코스 전체 길이(Bold), 자유산책은 시간(Medium) | 걸은 거리(Bold). 수치는 16 `Num`.

### Navigation
- 스택 헤더: Tese White, 그림자 없음, Pretendard SemiBold 제목, 뒤로 버튼 최소 표시. 걷는 중·결과 화면은 스와이프 뒤로가기를 막는다.
- 탭바: 산책·마이 2탭, 흰 면 + borderSubtle, 활성 Hunt Black, 비활성 textTertiary, 라벨 Pretendard Medium.

### Icons
SF Symbols(`expo-symbols`), 안드로이드·웹은 Material Symbols. 아웃라인이 기본이고 채운 모양은 상태(좋아요 켜짐, 선택 체크)와 정지 기호에만. 기본 색 Hunt Black.

## Motion

- 버튼 눌림: 한 단계 진한 면(카드는 투명도 0.85), 유리 버튼은 크기 0.94.
- 추천 코스 시트: spring(damping 26, stiffness 260, mass 0.9), 큰 바운스 없음.
- 좋아요: 누를 때만 하트가 ZoomIn 180ms로 바뀐다. 화면을 처음 열 때는 움직이지 않는다.
- 화면 전환은 네이티브 스택 기본. 페이지 진입 애니메이션은 따로 두지 않는다.
- 예외는 로그인 인트로 하나(앱 실행당 한 번): 로고와 PetRoad가 화면 가운데 1.3배로 나타나(400ms) 1.3초 머문 뒤 제자리로 줄어들며 이동(750ms, `bezier(0.16,1,0.3,1)`). 이어서 소개 문구, 입력칸, 버튼이 70ms 간격으로 12 올라오며 나타난다. 동작 줄이기가 켜져 있으면 이동 없이 페이드만.

## Do's and Don'ts

### Do
- 색·글자·간격·반경·그림자는 `@/constants/theme`에서 가져온다.
- 한 화면의 주 행동 하나만 Chew Yellow, 나머지는 secondary, 가장 약한 행동은 plain.
- 수치는 `Num`/`Stat`으로, 아래에 라벨을 붙인다.
- 지도 위 떠 있는 요소만 `Glass`로 감싼다.

### Don't
- 초록·주황 계열, 순수 검정(#000), 어두운 전면 배경, 다크 모드.
- Chew Yellow를 글자색으로 쓰기, 넓은 배경 면으로 깔기.
- 모든 카드에 그림자, 콘텐츠 화면에 유리 효과.
- 지도 자체에 필터나 색 오버레이.
- 도로·노면 표시 이미지(차선, 노면 페인트, 도로 표지식 숫자). 펫로드는 산책이지 도로가 아니다.
