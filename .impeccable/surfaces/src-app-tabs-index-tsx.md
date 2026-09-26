---
version: 1
slug: "src-app-tabs-index-tsx"
primary_target: "src/app/(tabs)/index.tsx"
related_targets: ["src/app"]
---

# PetRoad 앱 전체 (iOS, Operate)

범위: src/app 전 화면(온보딩 4, 산책 홈, 코스 상세, 산책 진행 2, 결과, 코스 등록, 마이 + 하위 6). 흐름·라우트·화면 구성은 현재 구현 그대로 유지. 지도·카메라·GPS는 플레이스홀더 유지(다음 단계에서 react-native-maps / expo-camera / expo-location 연결).

흐름 결정: 따라 걷기 결과에는 '코스로 등록하여 공유'가 없다. 남의 코스를 내 코스로 올리지 않도록 스케치 단계에서 정했고, 사용자는 그 구현 흐름을 그대로 유지하라고 했다.

방향 교체(사용자 지정): 첫 방향 '천변 노면 표시'(초록 트랙, 노면 노랑, 도로 표지 숫자)는 "너무 어둡다, 산책이지 도로가 아니다, 초록 무드는 빼라"는 요청으로 폐기. 바탕 #FEFFFA, 포인트 #FFD374는 사용자가 고정한 값이다. 라이트 모드 하나만 쓴다.

사용 장면: 퇴근 후나 주말 한낮, 동네를 한 손엔 리드줄 쥐고 걷는다. 폰은 한 손으로 짧게 본다.

## Direction contract

THESIS: 햇살 아래 동네 산책. 밝고 가벼운 바탕 위에 걸음이 햇살 노랑으로 차오른다. 도로·노면 은유와 어두운 스포츠 기록 앱 톤을 거부한다.

OWN-WORLD: 아이보리 바탕 #FEFFFA, 햇살 노랑 포인트 #FFD374, 옅은 노랑 패널 #FFF3D6, 따뜻한 짙은 회갈색 글자 #3D3A35(순수 검정 없음), 갈색 틴트 #9A6412, 따뜻한 갈색 기운의 옅은 그림자. 숫자는 둥근 Nunito 고정폭, 한글 UI는 시스템 서체. 버튼은 알약형. 아이콘은 SF Symbols. 한 화면에 노란 주 버튼은 하나. 모든 수치 아래 작은 라벨.

STORY: 켜자마자 지도에서 바로 걷고(노란 주 버튼), 옅은 노랑 시트에서 가까운 코스를 고르고, 걷는 동안 지도 위 노란 코스 카드에서 코스명과 걸은 거리 | 전체 길이를 보며, 끝나면 기록·공유·버리기 중 하나를 고른다.

FIRST VIEWPORT: 산책 홈. 상단 안전영역 아래 흰 알약에 동네 이름(좌)과 내 위치 버튼(우), 화면 대부분은 지도, 엄지 자리에 폭 전체 노란 '산책 시작하기' 알약(높이 56), 그 아래 옅은 노랑 바텀시트(그래버, '우리 동네 추천코스', 반경·개수, 가로 코스 카드). 시트는 끌어올리면 전체 목록.

FORM: 햇살 산책(사용자 지정 팔레트로 첫 방향 교체, 원래 seed key 0955febc). 시그니처: 산책 진행은 러닝 앱식 큰 수치 패널 없이 지도 전체 + 상단 햇살 노랑 코스 카드(사용자 레퍼런스 기반) + 하단 사진·종료. 추천코스 시트는 닫힘/반/전체(75%) 세 단계. 모션 문법: 시스템 전환 + 시트 스프링, Reduce Motion 존중.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
