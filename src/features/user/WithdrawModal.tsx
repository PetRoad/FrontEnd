import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Btn, PasswordField, Plate, T } from "@/components/common/ui";
import { gutter, radius, shadow, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { errorMessage } from "@/services/api";
import { withdraw } from "@/services/auth";

type Props = { visible: boolean; onClose: () => void };

// 되돌릴 수 없는 행동이라 비밀번호까지 확인한다. 성공하면 resetUser → 루트 guard가 로그인 화면으로
export function WithdrawModal({ visible, onClose }: Props) {
  const c = useTheme();
  const [password, setPassword] = useState("");
  const leave = useMutation({ mutationFn: () => withdraw(password) });

  const close = () => {
    if (leave.isPending) return;
    setPassword("");
    leave.reset();
    onClose();
  };
  const submit = () => {
    if (password && !leave.isPending) leave.mutate();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[s.backdrop, { backgroundColor: c.scrim }]}>
        <Pressable accessibilityLabel="닫기" onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={[s.card, { backgroundColor: c.surface }, shadow.float]}>
          <View style={{ gap: space.sm }}>
            <T v="heading">정말 탈퇴할까요?</T>
            <T v="bodySmall" muted>
              반려견 정보, 산책 기록과 사진, 내가 만든 코스까지 모든 정보가 삭제되고 되돌릴 수 없어요. 탈퇴하려면 비밀번호를 입력해주세요.
            </T>
          </View>
          <PasswordField
            placeholder="비밀번호"
            autoComplete="current-password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (leave.isError) leave.reset();
            }}
            returnKeyType="done"
            onSubmitEditing={submit}
            error={leave.error ? errorMessage(leave.error) : undefined}
          />
          <View style={s.actions}>
            <Btn title="취소" onPress={close} disabled={leave.isPending} style={{ flex: 1 }} />
            <Plate title="탈퇴하기" onPress={submit} disabled={!password} loading={leave.isPending} style={{ flex: 1 }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", padding: gutter },
  card: { borderRadius: radius.cardLg, padding: space.xl, gap: space.xl },
  actions: { flexDirection: "row", gap: space.sm },
});
