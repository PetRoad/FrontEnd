---
name: PetRoad
description: 반려견과 걸은 길과 순간을 기록하고, 우리 동네의 좋은 산책길을 발견하는 iOS 앱
colors:
  accent: "#FFD374"
  accent-soft: "#FFF3D6"
  on-accent: "#3D3A35"
  tint: "#9A6412"
  ground: "#FEFFFA"
  surface: "#FFFFFF"
  fill: "#F4F2EA"
  tile: "#F2EFE6"
  hairline: "#ECE9E0"
  ink: "#3D3A35"
  ink-muted: "#6E695F"
  map-tone: "#F4F2EA"
  map-street: "#FFFFFF"
  water: "#E3EEF2"
typography:
  numeral-hero:
    fontFamily: "Nunito_800ExtraBold, Nunito, system-ui"
    fontSize: "72px"
    fontWeight: 800
    lineHeight: 1.2
    fontFeature: "tnum"
  numeral:
    fontFamily: "Nunito_700Bold, Nunito, system-ui"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "tnum"
  large-title:
    fontFamily: "-apple-system, system-ui"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: "41px"
  title1:
    fontFamily: "-apple-system, system-ui"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
  title2:
    fontFamily: "-apple-system, system-ui"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  title3:
    fontFamily: "-apple-system, system-ui"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "25px"
  headline:
    fontFamily: "-apple-system, system-ui"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "-apple-system, system-ui"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "22px"
  subhead:
    fontFamily: "-apple-system, system-ui"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "20px"
  footnote:
    fontFamily: "-apple-system, system-ui"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  caption:
    fontFamily: "-apple-system, system-ui"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  field: "12px"
  tile: "14px"
  container: "16px"
  card: "18px"
  band: "20px"
  sheet: "24px"
  panel: "28px"
  pill: "9999px"
spacing:
  inline: "8px"
  stack: "10px"
  row: "12px"
  gutter: "16px"
  band: "20px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 20px"
  button-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 16px"
  button-soft:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 16px"
  button-plain:
    textColor: "{colors.ink-muted}"
    typography: "{typography.headline}"
    rounded: "{rounded.pill}"
    height: "50px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  chip-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    height: "50px"
    padding: "12px 14px"
  course-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "12px"
  stat-band:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.band}"
    padding: "20px"
  recommend-sheet:
    backgroundColor: "{colors.accent-soft}"
    rounded: "{rounded.sheet}"
---

# Design System: PetRoad

## Overview

**Creative North Star: "햇살 아래 동네 산책"**

펫로드는 밝고 가벼운 아이보리 바탕 위에서 걸음이 햇살 노랑으로 차오르는 앱이다. 한 손에 리드줄을 쥔 채 한낮 햇빛 아래에서 짧게 보는 화면이므로, 면은 밝게, 글자는 순수 검정 대신 따뜻한 짙은 회갈색으로 무게를 덜고, 행동은 엄지 자리의 알약 버튼 하나로 모은다.

구조는 iOS 기본 문법을 따른다. 시스템 서체의 텍스트 스타일 단계, 인셋 그룹 목록, 네이티브 스택 헤더와 2탭 탭바, SF Symbols 아이콘을 그대로 쓰고, 브랜드는 색과 숫자 서체, 산책 중 노란 코스 카드에서 나온다. 수치는 둥근 Nunito 고정폭 숫자로 크게 쓰고, 모든 수치 아래에는 작은 라벨이 붙는다.

사용자가 확정한 거부: 초록 무드, 도로·노면 표시 이미지("산책이지 도로가 아니다"), 어두운 스포츠 기록 앱 톤, 다크 모드. 앱은 라이트 모드 하나만 쓴다(app.json `userInterfaceStyle: light`, 상태바 dark).

**Key Characteristics:**
- 아이보리 바탕, 흰 표면, 옅은 노랑 패널의 세 겹 밝은 면
- 햇살 노랑은 주 버튼, 선택 상태, 채워진 단계 점, 내 위치 마커에만
- 순수 검정 없음: 글자는 따뜻한 회갈색, 그림자도 갈색 기운
- 숫자는 둥근 Nunito 고정폭, 한글 UI는 시스템 서체
- 모든 버튼과 칩은 알약형
- 시그니처: 산책 중 지도 위에 떠 있는 햇살 노랑 코스 카드(코스명 · 걸은 거리 | 전체 길이)

## Colors

밝은 아이보리 바탕 위에 햇살 노랑 하나, 나머지는 따뜻한 회갈색 계열 중립색으로 짠 한 가지 강조색 팔레트다. 모든 값은 `src/constants/colors.ts`의 `palette` 하나에서 나온다.

### Primary
- **햇살 노랑** (accent): 화면의 주 행동 버튼, 산책 중 상단 코스 카드, 선택된 칩, 채워진 단계 점, 난이도 점, 내 위치 마커, 선택된 사진 테두리. 글자색으로는 쓰지 않는다.
- **노랑 위 잉크** (on-accent): 햇살 노랑 면 위의 글자와 아이콘. 본문 잉크와 같은 회갈색이다.
- **옅은 햇살** (accent-soft): 수치 패널(결과·일지 상세), 추천코스 바텀시트, 로그인 상단 면, 보조 '부드러운' 버튼 바탕.

### Secondary
- **구운 갈색 틴트** (tint): 링크성 강조와 선택 상태의 글자·아이콘(탭바 활성, 좋아요 켜짐, 선택 체크, 입력 커서, 따라 걷기 '내가 걸은 길'). 바탕 위 대비 4.5:1 이상을 확보한 유일한 유색 글자색이다.

### Neutral
- **아이보리 바탕** (ground): 모든 화면, 스택 헤더, 하단 고정 행동 영역의 바탕.
- **흰 표면** (surface): 카드, 인셋 그룹, 입력칸, 지도 위 떠 있는 알약, 산책 진행 하단 버튼 영역, 탭바.
- **채움** (fill): 세그먼트 트랙, 눌린 행, 꺼진 난이도 점.
- **사진 자리** (tile): 사진·커버 플레이스홀더 면.
- **실선** (hairline): 카드·그룹·입력칸 테두리, 구분선, 꺼진 단계 점.
- **회갈색 잉크** (ink): 본문과 제목, 큰 수치.
- **흐린 잉크** (ink-muted): 라벨, 보조 문구, 단위, 비활성 탭, 화살표.
- **지도 톤 / 지도 길 / 물길** (map-tone, map-street, water): 지도 플레이스홀더 전용. 지도 밖 UI에는 쓰지 않는다.

### Named Rules
**The No Black Rule.** 순수 검정(#000)과 검정 기반 그림자를 쓰지 않는다. 가장 어두운 값은 회갈색 잉크다.

**The One Sun Rule.** 햇살 노랑 면은 한 화면의 주 행동 하나와 상태 표시(선택, 채워진 점, 내 위치)에만 쓴다. 장식 띠나 배경 면으로 넓게 깔지 않는다. 넓은 노랑 면이 필요하면 옅은 햇살을 쓴다. 예외는 사용자가 지정한 산책 중 상단 코스 카드 하나다.

**The No Green Rule.** 초록 계열 색은 팔레트 어디에도 없다. 성공·완료 상태도 노랑과 갈색 틴트로 표현한다.

## Typography

**Display Font:** Nunito 700 / 800 (`@expo-google-fonts/nunito`, 수치 전용)
**Body Font:** iOS 시스템 서체 (SF Pro / Apple SD Gothic Neo)

**Character:** 둥근 Nunito 숫자가 걸음의 가벼움을 맡고, 한글 UI는 시스템 서체의 iOS 텍스트 스타일 단계를 그대로 따라 익숙하게 읽힌다.

### Hierarchy
- **Numeral Hero** (800, 72px, 1.2, 고정폭): 결과 화면 거리. 결과·일지 보조 수치는 30px, 기본 Stat은 34px. 산책 중 코스 카드의 거리는 20px(걸은 거리 800, 전체 길이 700).
- **Numeral** (700, 13~22px, 1.2, 고정폭): 카드 거리, 좋아요 수, 행 오른쪽 수치, 단위(KM, 장, %), 온보딩 단계 표시.
- **Large Title / Title1 / Title2 / Title3** (700/700/700/600; 34/28/22/20px): 화면 제목(Title1: "오늘도 잘 걸었어요", 코스명), 시트 제목(Title3).
- **Headline** (600, 17px, 22px): 버튼 글자, 섹션 제목, 카드 코스명, 동네 이름 알약.
- **Body** (400, 17px, 22px): 행 제목, 입력칸.
- **Subhead / Footnote / Caption** (400; 15/13/12px): 보조 설명, 수치 라벨과 입력 라벨, 사진 자리 글자.

### Named Rules
**The Labeled Number Rule.** 모든 수치 아래에는 흐린 잉크 Footnote 라벨이 붙는다(거리, 시간, 사진). 단위는 수치 크기의 약 0.42배, 흐린 잉크로 기준선에 맞춘다.

**The Steady Digits Rule.** 수치는 항상 Nunito 고정폭 숫자(`tabular-nums`)로 쓴다. 걷는 중 값이 바뀌어도 자리가 흔들리지 않아야 한다. 수치가 아닌 한글 문장에는 Nunito를 쓰지 않는다.

## Layout

한 열 모바일 레이아웃. 페이지 여백 16px, 섹션 간격 24px, 섹션 안 간격 10px, 페이지 하단 여백 48px. 되돌릴 수 없는 행동과 주 행동은 하단 고정 행동 영역(아이보리 바탕, 위쪽 머리카락 실선, 안전영역 + 12px)에 엄지 높이로 둔다. 하단 고정 영역이 있는 화면은 스크롤 내용 하단 여백을 그만큼 늘린다.

산책 홈과 산책 진행은 지도가 화면 대부분을 차지하고, 그 위에 흰 알약(높이 40~44)이 안전영역 아래 떠 있다. 산책 홈은 옅은 햇살 바텀시트가 세 단계로 멈춘다: 닫힘(제목 줄 84만 남음), 반(304, 가로 코스 카드 폭 232), 전체(화면의 75%까지만, 세로 목록). 산책 시작 버튼은 시트 바로 위를 따라다닌다. 산책 진행은 지도가 화면 전체이고, 위에 햇살 노랑 코스 카드(반경 20: 코스명·"산책 중 · 시간" / 걸은 거리 | 전체 길이, 자유 산책은 걸은 거리만), 아래에 흰 버튼 영역(상단 모서리 28)에 사진·종료 두 버튼만 둔다. 러닝 앱처럼 큰 수치 패널을 두지 않는다.

목록은 iOS 인셋 그룹(흰 표면, 행 최소 높이 52, 좌측 16 들여 쓴 머리카락 구분선)을 쓴다.

## Elevation & Depth

기본은 평면이다. 면의 층은 아이보리 바탕 → 흰 표면 → 옅은 햇살의 밝기 차와 실선 테두리로 나눈다. 그림자는 지도 위에 떠 있는 요소와 코스 카드, 선택된 세그먼트에만 쓴다.

### Shadow Vocabulary
- **따뜻한 떠 있음** (`box-shadow: 0 4px 16px rgba(120, 96, 52, 0.10)`): 지도 위 알약·내 위치 버튼·산책 시작 버튼, 산책 진행 코스 카드와 하단 버튼 영역, 따라 걷기 범례, 코스 카드, 선택된 세그먼트 칸, 내 위치 점.

### Named Rules
**The Warm Shadow Rule.** 그림자는 위의 따뜻한 갈색 한 가지뿐이다. 회색·검정 그림자나 단단한 오프셋 그림자를 쓰지 않는다.

## Shapes

둥근 형태 하나로 통일한다. 누를 수 있는 것(버튼, 칩, 지도 위 알약, 내 위치 버튼)은 모두 높이의 절반 반경의 알약이고, 상태 점(단계 점, 난이도 점)은 완전한 원이다. 담는 면은 크기가 클수록 반경도 커진다: 입력칸·세그먼트 12, 사진 자리 14, 지도·커버·그룹 16, 코스 카드 18, 수치 패널·산책 중 코스 카드 20, 바텀시트 상단 24, 산책 진행 하단 버튼 영역 상단 28. 반려견 프로필 사진과 마이 아바타는 원이다. 카드 안 커버는 반경 0으로 카드 모서리에 잘린다.

## Components

### Buttons
알약형, 가볍게 눌린다.
- **Shape:** 알약(높이의 절반).
- **Primary (햇살 노랑 주 버튼):** 햇살 노랑 바탕, 노랑 위 잉크 Headline, 높이 56, 좌우 20, 선택적 아이콘 20. 화면당 하나, 그 화면의 주 행동(산책 시작하기, 로그인, 기록 저장, 이 코스 따라 걷기, 종료)에만.
- **Surface:** 흰 표면 + 실선 테두리, 잉크 글자, 최소 높이 50. 보조 행동(코스로 등록하여 공유).
- **Soft:** 옅은 햇살 바탕, 잉크 글자. 주 버튼 옆 짝 행동(산책 중 사진).
- **Plain:** 투명, 흐린 잉크 글자. 가장 약한 행동(기록 버리기, 회원가입 전환).
- **Pressed / Disabled:** 눌림은 투명도 0.82(주) / 0.7(보조), 비활성은 0.4. 호버 상태는 없다(터치 전용).

### Chips
- **Style:** 알약, 높이 36, 좌우 14, 흰 표면 + 실선 테두리, Subhead 잉크.
- **State:** 선택되면 햇살 노랑 면 + 노랑 위 잉크, 굵기 600. 읽기 전용 태그(코스 상세)도 같은 모양.

### Cards / Containers
- **Corner Style:** 코스 카드 18, 인셋 그룹 16, 수치 패널 20.
- **Background:** 카드·그룹은 흰 표면, 수치 패널은 옅은 햇살.
- **Shadow Strategy:** 코스 카드만 따뜻한 떠 있음. 그룹과 패널은 평면.
- **Border:** 카드·그룹은 실선 1px. 패널은 테두리 없음.
- **Internal Padding:** 카드 본문 12, 수치 패널 20.
- **코스 카드 라벨 그리드:** 커버(높이 104) / 코스명 / 거리(Nunito 22 + KM)·난이도 점·좋아요 / 견종·나이. 모든 카드가 같은 순서.

### Inputs / Fields
- **Style:** 흰 표면, 실선 1px, 반경 12, 최소 높이 50, Body 잉크, 위에 Footnote 흐린 라벨.
- **Focus:** 선택·커서 색은 갈색 틴트. 별도 포커스 테두리는 없다.
- **Segmented:** 채움 트랙(반경 12, 높이 40) 안에서 선택 칸만 흰 표면 + 따뜻한 떠 있음.

### Navigation
- **스택 헤더:** 아이보리 바탕, 그림자 없음, 잉크 제목, 뒤로 버튼은 최소 표시. 걷는 중·결과 화면은 스와이프 뒤로가기를 막는다.
- **탭바:** 산책·마이 2탭, 흰 표면 + 실선, 활성 갈색 틴트, 비활성 흐린 잉크, SF Symbols 24.

### Dots
둥근 점을 가로로 고르게 벌려 놓은 단계 표시. 꺼진 점은 실선 색, 채워진 점은 햇살 노랑으로 450ms 페이드인한다. 온보딩 단계 표시(10px 점 + Nunito "n/N")와 로그인 상단 장식에 쓰고, 난이도는 8px 점 3개로 같은 문법을 따른다. 점만으로 정보를 전하지 않고 글자를 함께 둔다.

### 산책 중 코스 카드 (시그니처)
지도 위 안전영역 아래 좌우 16에 떠 있는 햇살 노랑 카드(반경 20, 따뜻한 떠 있음). 왼쪽: 코스명(Headline) + "산책 중 · 00:00:00"(Footnote), 오른쪽: 걸은 거리(Nunito 800 20) | 전체 길이(Nunito 700 20), 사이에 반투명 세로 선. 자유 산책은 남은 거리 개념이 없으므로 걸은 거리만 둔다. 글자는 모두 노랑 위 잉크.

### Map Placeholder
지도 연결 전까지 지도 톤 블록, 흰 길, 비스듬한 물길로 동네 지도 느낌만 낸다. 내 위치는 햇살 노랑 원(흰 테두리 3)과 옅은 노랑 후광 48. 따라 걷기 범례: 원래 코스는 노랑 점선(점 3개), 내가 걸은 길은 갈색 틴트 실선, 내 위치는 노랑 점 + 틴트 테두리.

## Do's and Don'ts

### Do:
- **Do** 모든 색을 `useTheme()`가 돌려주는 `palette`에서 가져온다. 화면에 hex를 직접 쓰지 않는다.
- **Do** 한 화면의 주 행동 하나만 햇살 노랑 알약(높이 56)으로 두고, 짝 행동은 Soft, 보조는 Surface, 가장 약한 행동은 Plain으로 내린다.
- **Do** 수치는 Nunito 고정폭으로 쓰고 아래에 흐린 Footnote 라벨을 붙인다.
- **Do** 진행·단계·난이도는 둥근 점으로 표시하고, 점 옆이나 아래에 글자 정보를 함께 둔다.
- **Do** 그림자가 필요하면 따뜻한 떠 있음(`0 4px 16px rgba(120, 96, 52, 0.10)`) 하나만 쓴다.
- **Do** 되돌릴 수 없는 행동은 하단 고정 영역에 두고 확인을 거친다.

### Don't:
- **Don't** 초록 계열 색을 쓰지 않는다(사용자 지정).
- **Don't** 도로·노면 표시 이미지(차선, 노면 페인트, 도로 표지식 숫자, 트랙)를 쓰지 않는다. 펫로드는 산책이지 도로가 아니다(사용자 지정). 지도 플레이스홀더의 길은 지도 안에서만 허용된다.
- **Don't** 순수 검정 글자, 검정 그림자, 어두운 전면 배경을 쓰지 않는다.
- **Don't** 다크 모드나 색 반전 테마를 만들지 않는다. 앱은 라이트 모드 하나다.
- **Don't** 햇살 노랑을 글자색으로 쓰지 않는다. 밝은 바탕 위에서 읽히지 않는다. 노랑 계열 글자가 필요하면 갈색 틴트를 쓴다.
- **Don't** 버튼과 칩을 각진 사각형으로 만들지 않는다.
