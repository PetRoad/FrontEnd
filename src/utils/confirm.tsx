import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Btn, Plate, T } from "@/components/common/ui";
import { radius, shadow, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

// onCancel: 왼쪽 버튼을 눌렀을 때만. 바깥을 누르거나 뒤로가기로 닫으면 아무것도 하지 않는다
type Options = { title: string; message: string; ok: string; cancel?: string; onOk: () => void; onCancel?: () => void };

let show: ((o: Options) => void) | undefined;

// 확인 모달. OS Alert는 버튼 색·정렬을 못 바꿔 직접 그린다. 루트 레이아웃의 ConfirmHost가 그린다
export function confirm(o: Options) {
  show?.(o);
}

export function ConfirmHost() {
  const c = useTheme();
  const [o, setO] = useState<Options>();
  useEffect(() => {
    show = setO;
    return () => {
      show = undefined;
    };
  }, []);

  const close = () => setO(undefined);
  const pick = (fn?: () => void) => {
    close();
    fn?.();
  };

  return (
    <Modal visible={!!o} transparent animationType="fade" onRequestClose={close}>
      <View style={[s.backdrop, { backgroundColor: c.scrim }]}>
        <Pressable accessibilityLabel="닫기" onPress={close} style={StyleSheet.absoluteFill} />
        {o && (
          <View accessibilityViewIsModal style={[s.card, { backgroundColor: c.surface }, shadow.float]}>
            <View style={s.text}>
              <T v="bodyStrong" center>
                {o.title}
              </T>
              <T muted center>
                {o.message}
              </T>
            </View>
            <View style={s.actions}>
              <Btn compact title={o.cancel ?? "취소"} onPress={() => pick(o.onCancel)} style={s.btn} />
              <Plate compact title={o.ok} onPress={() => pick(o.onOk)} style={s.btn} />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// 탈퇴 모달도 같은 모양을 쓴다
// 폭: 화면 좌우 40씩 비우고 최대 320(iOS 알림 270, Material 다이얼로그 최소 280 사이에서 한글 두 줄이 편한 폭)
// 버튼: 둘 다 높이 52로 맞추고, 모서리는 카드(24)와 안쪽 여백(20)에 어울리게 14
export const modalStyle = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: space.huge },
  card: { width: "100%", maxWidth: 320, borderRadius: radius.cardLg, paddingTop: space.xxl, paddingHorizontal: space.xl, paddingBottom: space.xl, gap: space.xxl },
  text: { gap: space.sm, paddingHorizontal: space.xs },
  actions: { flexDirection: "row", gap: space.sm },
  btn: { flex: 1, borderRadius: radius.input },
});
const s = modalStyle;
