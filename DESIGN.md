---
name: PetRoad
description: 매일 밟는 천변 산책로 바닥이 곧 앱이 되는 반려견 산책 기록 iOS 앱
colors:
  track: "#1F5C45"
  on-track: "#FFFFFF"
  on-track-muted: "#BFD6CB"
  on-track-veil: "rgba(255, 255, 255, 0.14)"
  on-track-veil-line: "rgba(255, 255, 255, 0.3)"
  on-track-lane-off: "rgba(255, 255, 255, 0.18)"
  paint: "#FFC61A"
  on-paint: "#151716"
  ground: "#ECEEEA"
  surface: "#FFFFFF"
  raised: "#FFFFFF"
  fill: "#E0E4DE"
  ink: "#151716"
  ink-muted: "#545B57"
  hairline: "#D3D8D2"
  tint: "#1F5C45"
  tile: "#DADFD8"
  map-tone: "#E4E8E0"
  map-road: "#F7F8F5"
  stream: "#C9DDD2"
  ground-dark: "#0E1110"
  surface-dark: "#191D1B"
  raised-dark: "#333A36"
  fill-dark: "#242926"
  ink-dark: "#EDF0EC"
  ink-muted-dark: "#9BA39E"
  hairline-dark: "#2B312E"
  tint-dark: "#6CC79F"
  tile-dark: "#232926"
  map-tone-dark: "#171B19"
  map-road-dark: "#222825"
  stream-dark: "#1D3329"
typography:
  numeral-hero:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "96px"
    fontWeight: 700
    lineHeight: 1.08
    fontFeature: "tnum"
  numeral:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.08
    fontFeature: "tnum"
  large-title:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: "41px"
  title1:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "34px"
  title2:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "28px"
  title3:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "25px"
  headline:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: "22px"
  body:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "22px"
  subhead:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "20px"
  footnote:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
  caption:
    fontFamily: "-apple-system, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  segment-item: "8px"
  tile: "10px"
  control: "12px"
  plate: "14px"
  inset-map: "16px"
  band: "20px"
  sheet: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  track-panel: "20px"
  xl: "24px"
components:
  plate:
    backgroundColor: "{colors.paint}"
    textColor: "{colors.on-paint}"
    typography: "{typography.headline}"
    rounded: "{rounded.plate}"
    height: "56px"
    padding: "0 20px"
  button-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.control}"
    height: "50px"
    padding: "0 16px"
  button-track:
    backgroundColor: "{colors.track}"
    textColor: "{colors.on-track}"
    typography: "{typography.headline}"
    rounded: "{rounded.control}"
    height: "50px"
    padding: "0 16px"
  button-on-track:
    backgroundColor: "{colors.on-track-veil}"
    textColor: "{colors.on-track}"
    typography: "{typography.headline}"
    rounded: "{rounded.control}"
    height: "50px"
    padding: "0 16px"
  button-plain:
    textColor: "{colors.tint}"
    typography: "{typography.headline}"
    height: "50px"
    padding: "0 16px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "50px"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  chip-on:
    backgroundColor: "{colors.track}"
    textColor: "{colors.on-track}"
    typography: "{typography.subhead}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  segmented:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.tile}"
    height: "40px"
    padding: "2px"
  segmented-selected:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment-item}"
  course-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "12px"
  map-pill:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 16px"
  list-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "52px"
    padding: "12px 16px"
---

# Design System: PetRoad

## Overview

**Creative North Star: "천변 노면 표시"**

앱은 매일 걷는 천변 산책로의 바닥 그 자체다. 우레탄 트랙의 짙은 초록 면 위에 노면 노랑과 흰 선으로 거리 표지가 칠해지고, 그 둘레는 보도 콘크리트처럼 무채색으로 비어 있다. 걸은 거리는 카드 속 숫자가 아니라 트랙 위에 칠한 거리 표지처럼 읽힌다. 파스텔 둥근 카드와 발바닥 아이콘으로 된 펫앱 기본형은 이 세계의 거부 대상이다.

밀도는 iOS 기본을 따르되, 한 손에 리드줄을 쥐고 다른 한 손으로 잠깐 보는 장면에 맞춘다. 주 행동은 엄지 높이에 놓인 폭 전체의 노란 판 하나, 수치는 도로 표지 계열의 콘덴스드 숫자로 크게, 나머지는 시스템 한글 서체와 iOS 인셋 그룹 목록이 조용히 받친다. 라이트와 다크 모두 시스템 설정을 따르고, 트랙·노면 색은 두 모드에서 같다.

지도(`MapPlate`)와 사진(`PhotoTile`)은 react-native-maps / expo-camera / expo-location 연결 전까지의 자리 표시다. 동네 블록 격자와 비스듬한 천(川) 띠로 지도 톤만 내며, 실제 지도가 들어와도 `mapTone`·`stream`·`MeMarker`의 색 관계는 유지한다.

**Key Characteristics:**
- 트랙 초록 면 위에 수치가 놓인다: 바텀시트, 산책 진행 패널, 결과 밴드, 로그인 히어로.
- 노면 노랑은 주 행동 판 하나와 노면 표시(점선 칸, 기록 점, 중앙선)에만.
- 모든 숫자·단위는 Barlow Condensed 고정폭, 한글 UI는 시스템 서체.
- 점선(`Lane`)이 진행·단계·난이도를 모두 말한다.
- 아이콘은 SF Symbols만.

## Colors

아스팔트 잉크와 보도 콘크리트의 무채색 바탕에, 색은 트랙 초록 면과 노면 노랑 표시 두 가지뿐이다.

### Primary
- **우레탄 트랙 초록** (`track`): 수치를 올려놓는 면. 홈 바텀시트, 산책 진행 하단 패널, 결과 거리 밴드, 로그인 히어로, 선택된 칩, `Steps`의 칠해진 칸. 라이트 모드에서는 `tint`도 같은 값이다.
- **트랙 위 흰 글자** (`on-track`) / **트랙 위 흐린 글자** (`on-track-muted`): 트랙 면 위의 수치와 라벨·단위. 트랙 위에서는 이 두 값만 쓴다.

### Secondary
- **노면 노랑** (`paint`): 주 행동 `Plate`의 면, 거리 눈금의 칠해진 칸, 기록 중 점, 로그인 중앙선 점선. 그 위 글자는 항상 `on-paint`(아스팔트 잉크).

### Neutral
- **보도 콘크리트** (`ground` / `ground-dark`): 화면 바탕, 내비게이션 헤더, `BottomBar`.
- **표면** (`surface` / `surface-dark`): 인셋 그룹, 입력칸, 코스 카드, 탭 바.
- **떠 있는 면** (`raised` / `raised-dark`): 지도 위에 떠 있는 알약(동네 이름, 기록 중), 위치 버튼, 범례, 세그먼트 선택 칸. 다크에서는 `fill`·`mapTone`보다 밝게 두어 지도 위에서 가장자리가 보이게 한다.
- **채움** (`fill`): 세그먼트 바탕, 눌린 행.
- **아스팔트 잉크** (`ink`) / **흐린 잉크** (`ink-muted`): 모든 본문과 라벨.
- **실선** (`hairline`): 테두리, 구분선, 꺼진 점선 칸.
- **틴트** (`tint` / `tint-dark`): 헤더 뒤로가기, 탭 활성, 행 아이콘, `plain` 버튼 글자, 선택 테두리, 내 위치 마커. 다크에서는 밝은 초록으로 올린다.
- **지도 톤** (`tile`, `map-tone`, `map-road`, `stream`): 자리 표시용 사진 타일과 지도 블록·길·천 띠.
- **트랙 위 반투명** (`on-track-veil`, `on-track-veil-line`, `on-track-lane-off`): 트랙 면 위의 보조 버튼 면·테두리와 꺼진 거리 눈금 칸.

### Named Rules
**The One Plate Rule.** 노란 판(`Plate`)은 한 화면에 하나, 그 화면의 주 행동에만 쓴다. 노랑의 다른 쓰임은 노면 표시(칠해진 눈금 칸, 기록 점, 중앙선)뿐이며 글자색으로는 쓰지 않는다.

**The Colorless Body Rule.** 본문과 라벨은 `ink`·`ink-muted`만 쓴다. 색은 트랙 면, 노면 표시, 그리고 `tint`로 칠한 조작 요소(링크성 버튼, 아이콘, 선택 상태)에만 있다.

## Typography

**Display Font:** Barlow Condensed 600/700 (`@expo-google-fonts/barlow-condensed`, 루트 레이아웃에서 로드)
**Body Font:** 시스템 서체 (iOS SF Pro / Apple SD Gothic Neo)

**Character:** 수치는 고속도로 표지처럼 좁고 곧게 서고, 한글 문장은 iOS 텍스트 스타일 그대로 차분하다. 표지와 안내문의 관계다.

### Hierarchy
- **Numeral** (Barlow Condensed 700, 96px 산책 진행 거리 / 72px 결과 거리 / 34px 기본 `Stat` / 20-22px 목록·카드, line-height 1.08, tabular-nums): 모든 거리·시간·개수·날짜. 단위(`KM`, `%`, `장`)는 같은 서체 600, 숫자 크기의 0.42배, 흐린 색.
- **Large Title / Title 1-3** (700·700·700·600, 34/28/22/20px): 화면 제목과 시트 제목. 결과 인사말은 Title 1, 추천 시트 제목은 Title 3.
- **Headline** (600, 17/22px): 버튼, 섹션 제목, 카드 코스명.
- **Body** (400, 17/22px): 입력값, 행 제목.
- **Subhead** (400, 15/20px): 보조 설명, 칩, 세그먼트.
- **Footnote / Caption** (400, 13/18 · 12/16px): 수치 아래 라벨, 입력 라벨, 그룹 머리말.

### Named Rules
**The Sign Numeral Rule.** 숫자는 반드시 `Num`/`Stat`(Barlow Condensed, 고정폭)으로 쓴다. 걷는 동안 자릿수가 흔들리지 않게 하는 것이 목적이다. 한글에는 이 서체를 쓰지 않는다.

**The Label Beneath Rule.** 모든 수치 아래에는 작은 footnote 라벨이 붙는다(`Stat`). 라벨 없는 숫자는 두지 않는다.

## Layout

단일 열 모바일 레이아웃. 스크롤 화면(`Page`)은 사방 16px 여백, 블록 사이 24px 간격, 하단 48px. 트랙 면 패널(산책 진행, 결과 밴드)은 안쪽 20px, 수치 블록 사이 18px, 나란한 `Stat` 사이 28px. 온보딩 폼은 24px 여백에 입력칸 사이 16px.

주 행동은 엄지 높이에 둔다. 지도 화면에서는 `Plate`가 좌우 16px 폭 전체로 바텀시트 바로 위에 뜨고, 목록형 화면에서는 `BottomBar`(바탕색 `ground`, 위 실선, 하단 안전영역 + 12px)가 주 행동과 보조 행동을 세로로 쌓는다(간격 10px). 홈 바텀시트는 접힌 높이 304px에서 가로 스크롤 코스 카드(폭 232px, 간격 12px)를 보여주고, 끌어올리면 세로 목록이 된다. 지도 위 요소는 상단 안전영역 + 8px에 놓는다.

## Elevation & Depth

기본은 평면이다. 깊이는 면 색의 단계(`ground` → `surface` → `raised`)와 트랙 초록 면이 지도 위로 24px 둥근 모서리로 겹쳐 올라오는 것으로 표현한다. 그림자는 하나뿐이며 부드럽다.

### Shadow Vocabulary
- **떠 있음** (`box-shadow: 0 2px 10px rgba(0, 0, 0, 0.10)`): 지도 위 알약·위치 버튼·범례·시작 판, 트랙 면 위의 코스 카드, 세그먼트 선택 칸, 내 위치 점.

### Named Rules
**The Float-Over-Map Rule.** 그림자는 지도나 트랙 면 위에 떠 있는 요소에만 준다. 바탕 위 목록·입력칸·버튼에는 주지 않는다. 다크에서는 그림자가 거의 보이지 않으므로 `raised-dark`의 밝기로 가장자리를 만든다.

## Shapes

모서리는 크기에 따라 단계적으로 커진다: 세그먼트 칸 8px, 타일·세그먼트 10px, 버튼·입력칸·그룹·범례 12px, 주 행동 판·코스 카드 14px, 인셋 지도 16px, 결과 밴드 20px, 트랙 시트 위쪽 24px. 지도 위 알약과 칩은 완전한 알약형. 점선 칸은 높이의 절반을 반지름으로 한 짧은 막대이며, 칸 사이 6px(난이도 표시는 9×4px 막대, 간격 2px). 테두리는 1px 실선(`hairline`), 구분선은 hairline 두께로 왼쪽 16px 들여 시작한다. 프로필 사진 자리만 원형(112px)이다.

## Components

### Buttons
노면에 칠한 판처럼 넓고 평평하다. 눌림은 불투명도로만 표현한다.
- **Shape:** 판 14px, 일반 버튼 12px.
- **Primary (`Plate`):** 노면 노랑 면, 잉크 글자, 높이 56px, 좌우 20px, 아이콘 20px + 간격 8px. 눌림 0.82, 비활성 0.4.
- **Secondary (`Btn`):** 최소 높이 50px, 1px 테두리. `surface`(표면 + 실선), `track`(트랙 초록 면 + 흰 글자), `onTrack`(트랙 위 반투명 흰 면과 테두리), `plain`(투명, `tint` 글자: 회원가입, 기록 버리기 같은 약한 행동). 눌림 0.7, 비활성 0.4.

### Chips
- **Style:** 높이 36px 알약형, 1px 테두리, subhead.
- **State:** 꺼짐은 `surface` + `hairline`, 켜짐은 트랙 초록 면 + 흰 글자 600.

### Cards / Containers
- **코스 카드:** 14px 모서리, `surface`, 떠 있음 그림자, 위쪽 104px 커버 자리, 본문 12px. 모든 카드가 같은 라벨 그리드를 쓴다: 코스명(headline) / 거리 `Num` + KM · 난이도 점선 · 좋아요 / 견종 · 나이(subhead muted).
- **인셋 그룹 (`Group`/`Row`):** iOS 인셋 그룹 목록. 12px 모서리 `surface`, 행 최소 52px, 행 아이콘 `tint`, 오른쪽 수치는 `Num` 20px 흐린 색, 탐색 행에는 셰브런.
- **결과 밴드:** 트랙 초록 20px 모서리 면에 거리 72px `Stat`과 30px 보조 `Stat`들.

### Inputs / Fields
- **Style:** 최소 높이 50px, 12px 모서리, 1px `hairline`, `surface` 바탕, body 글자. 라벨은 위에 footnote muted, 간격 6px.
- **Focus:** 커서·선택색은 `tint`. 날짜 칸은 선택기가 열리면 테두리가 `tint`로 바뀐다.
- **Segmented:** `fill` 바탕 40px, 안쪽 2px, 선택 칸은 `raised` + 떠 있음 그림자 + 600.

### Navigation
- 스택 헤더는 `ground` 바탕, 그림자 없음, 뒤로가기는 `tint` 최소형. 탭 바는 `surface` 바탕, 활성 `tint`, 비활성 `ink-muted`, SF Symbols 24px. 산책 진행·결과 화면은 스와이프 뒤로가기를 막는다.

### Lane (거리 눈금)
시그니처 요소. 같은 폭의 점선 칸이 한 줄로 서고, 칠해진 칸은 450ms 페이드로 한 번 채워진다. 산책 진행 화면에서는 10칸 = 1km, 100m마다 한 칸이 노면 노랑으로 칠해지며 꺼진 칸은 트랙 위 반투명 흰색이다. 아래에 "다음 100m 표지까지 Nm" footnote가 붙는다. 온보딩 `Steps`는 같은 부품을 트랙 초록 / 실선 색으로 쓴다.

### Map Plate (자리 표시)
`mapTone` 바탕에 9px 폭 길 격자와 -14° 기울어진 46px `stream` 띠. 가운데 `MeMarker`(48px 틴트 후광 20% + 20px 틴트 점, 흰 3px 테두리). 실제 지도로 교체될 자리이며, 교체 후에도 내 위치 마커와 떠 있는 요소 규칙은 유지한다.

## Do's and Don'ts

### Do:
- **Do** 트랙 초록 면 위에 수치를 올리고, 그 위 글자는 `on-track` / `on-track-muted`만 쓴다.
- **Do** 모든 숫자를 `Num`/`Stat`(Barlow Condensed, tabular-nums)로 쓰고 아래에 footnote 라벨을 붙인다.
- **Do** 진행·단계·난이도는 `Lane` 계열 점선 칸으로 표현한다.
- **Do** 주 행동은 폭 전체 56px `Plate`로 엄지 높이(지도 위 하단 또는 `BottomBar`)에 둔다.
- **Do** 지도 위에 뜨는 요소는 `raised` + 떠 있음 그림자로 만든다.
- **Do** 새 색은 `palettes.light`와 `palettes.dark` 양쪽에 같은 키로 추가한다.

### Don't:
- **Don't** 한 화면에 노란 판을 두 개 이상 두거나, 노랑을 글자색·장식색으로 쓰지 않는다.
- **Don't** 파스텔 둥근 카드와 발바닥 아이콘 같은 펫앱 기본형을 쓰지 않는다.
- **Don't** SF Symbols 외의 아이콘(이모지, 글리프 문자)을 쓰지 않는다.
- **Don't** 본문 문장에 색을 칠하지 않는다. 색은 트랙 면, 노면 표시, 조작 요소의 `tint`에만.
- **Don't** 바탕 위 일반 목록·버튼·입력칸에 그림자를 주지 않는다.
