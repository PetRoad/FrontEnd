import { Alert, Platform } from "react-native";

type Options = { title: string; message: string; ok: string; cancel?: string; destructive?: boolean; onOk: () => void };

// 되돌릴 수 없는 행동 확인. 웹에는 Alert 버튼이 없어 window.confirm으로 대신한다
export function confirm({ title, message, ok, cancel = "취소", destructive, onOk }: Options) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n${message}`)) onOk();
    return;
  }
  Alert.alert(title, message, [
    { text: cancel, style: "cancel" },
    { text: ok, style: destructive ? "destructive" : "default", onPress: onOk },
  ]);
}
