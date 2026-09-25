import { View } from "react-native";
import { router } from "expo-router";
import { Field, Page, Plate, T } from "@/components/common/ui";

export default function SignupScreen() {
  return (
    <Page>
      <View style={{ gap: 6 }}>
        <T v="title1">계정을 만들어요</T>
        <T v="subhead" muted>
          가입하면 동네와 반려견만 알려주시면 돼요.
        </T>
      </View>
      <View style={{ gap: 16 }}>
        <Field label="이메일" placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="비밀번호" placeholder="8자 이상" secureTextEntry autoComplete="new-password" />
        <Field label="비밀번호 확인" placeholder="한 번 더 입력" secureTextEntry autoComplete="new-password" />
        <Field label="닉네임" placeholder="산책하는 콩이 보호자" />
      </View>
      <Plate title="가입하고 시작하기" onPress={() => router.push("/region")} />
    </Page>
  );
}
