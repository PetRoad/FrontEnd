---
version: 1
slug: "src-app-tabs-index-tsx"
primary_target: "src/app/(tabs)/index.tsx"
related_targets: ["src/app"]
---

# PetRoad 앱 전체 (iOS, Operate)

범위: src/app 전 화면(온보딩 4, 산책 홈, 코스 상세, 산책 진행 2, 결과, 코스 등록, 마이 + 하위 6). 흐름·라우트·화면 구성은 현재 구현 그대로 유지. 지도·카메라·GPS는 플레이스홀더 유지(다음 단계에서 react-native-maps / expo-camera / expo-location 연결).

흐름 결정: 따라 걷기 결과에는 '코스로 등록하여 공유'가 없다. 남의 코스를 내 코스로 올리지 않도록 스케치 단계에서 정했고, 사용자는 그 구현 흐름을 그대로 유지하라고 했다.

사용 장면: 퇴근 후 가로등 아래나 주말 한낮 천변, 한 손엔 리드줄, 폰은 한 손으로 짧게 본다. 라이트·다크 모두 시스템 설정을 따른다.

## Direction contract

THESIS: 매일 밟는 천변 산책로 바닥이 곧 앱이다. 걸은 거리는 우레탄 트랙 위에 칠한 거리 표지처럼 읽힌다. 파스텔 둥근 카드와 발바닥 아이콘의 펫앱 기본형을 거부한다.

OWN-WORLD: 우레탄 트랙 초록(#1F5C45) 면, 노면 노랑(#FFC61A) 판, 아스팔트 잉크(#151716), 노면 흰 실선·점선, 보도 콘크리트(#ECEEEA) 바탕. 숫자·단위는 Barlow Condensed(고속도로 표지 계열) 고정폭, 한글 UI는 시스템 서체. 아이콘은 SF Symbols. 한 화면에 노란 판은 주 행동 하나뿐. 본문은 무채색, 색은 트랙 면과 노면선에만. 모든 수치 아래 작은 라벨.

STORY: 켜자마자 지도에서 바로 걷고(노란 판), 트랙색 시트에서 가까운 코스를 고르고, 걷는 동안 거리 표지가 100m마다 한 칸씩 칠해지며, 끝나면 기록·공유·버리기 중 하나를 고른다.

FIRST VIEWPORT: 산책 홈. 상단 안전영역 아래 동네 이름(좌), 화면 대부분은 지도, 엄지 자리에 폭 전체 노란 '산책 시작하기' 판(높이 56), 그 아래 트랙 초록 바텀시트(그래버, '우리 동네 추천코스', 반경·개수, 가로 코스 카드). 시트는 끌어올리면 전체 목록.

FORM: 천변 노면 표시, 자체 후보 목록 5순위, seed key 0955febc. 시그니처 인터랙션: 산책 진행 화면의 거리 눈금(10칸=1km)이 100m마다 노랗게 칠해짐. 모션 문법: 시스템 전환 + 눈금 채움 한 번, Reduce Motion 존중.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
