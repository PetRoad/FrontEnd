// 서버가 저장을 거절하지 않도록 앱이 맞추는 상한. 서버 값을 바꾸면 함께 바꾼다
export const LIMIT = {
  photos: 100, // 산책 한 번의 사진 수
  title: 100, // 산책 이름 글자 수. 따라 걷기는 남이 지은 코스 이름이 그대로 들어온다
  walkPoints: 20000,
  coursePoints: 5000,
  walkKm: 200,
  walkSec: 48 * 3600,
  dogName: 20,
} as const;
