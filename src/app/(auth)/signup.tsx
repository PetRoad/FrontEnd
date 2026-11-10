import { useRef, useState } from "react";
import { Alert, View, type TextInputInstance } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { BigField, Page, PasswordField, Plate, T } from "@/components/common/ui";
import { space } from "@/constants/theme";
import { errorMessage } from "@/services/api";
import { login, signup } from "@/services/auth";

// 서버 규칙과 같다: 공백 없는 영문·숫자·특수문자 8~14자
const PASSWORD = /^[\x21-\x7E]{8,14}$/;
const EMAIL = /^\S+@\S+\.\S+$/;
// iOS 추천 비밀번호(기본 20자)가 서버 규칙 안에서 만들어지도록. 공백이 섞이지 않게 특수문자는 직접 고른다
const PASSWORD_RULES = "minlength: 8; maxlength: 14; required: lower; required: upper; required: digit; required: [-!@#$%^&*_+=?.];";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [checked, setChecked] = useState(false); // 처음 누르기 전에는 빨간 안내를 띄우지 않는다
  // 가입까지 됐는데 이어지는 로그인이 실패했을 때, 같은 이메일·비밀번호로 다시 누르면 로그인만 다시 한다
  const joined = useRef("");
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmRef = useRef<TextInputInstance>(null);

  const errors = {
    email: EMAIL.test(email.trim()) ? undefined : "이메일 형식을 확인해주세요.",
    password: PASSWORD.test(password) ? undefined : "공백 없이 영문·숫자·특수문자 8~14자로 입력해주세요.",
    confirm: confirm === password ? undefined : "비밀번호가 서로 달라요.",
  };
  const valid = !errors.email && !errors.password && !errors.confirm;

  // 가입은 토큰을 주지 않아 바로 로그인까지 이어서 한다. 뒤로가기는 로그인 화면으로
  const key = `${email.trim().toLowerCase()}\n${password}`;
  const join = useMutation({
    mutationFn: async () => {
      if (joined.current !== key) {
        await signup(email, password);
        joined.current = key;
      }
      await login(email, password);
    },
    onSuccess: () => router.replace("/region"),
    onError: (e) =>
      joined.current === key
        ? Alert.alert("가입은 완료됐어요.", `로그인하지 못했어요. 다시 눌러주세요.\n${errorMessage(e)}`)
        : Alert.alert("가입하지 못했어요.", errorMessage(e)),
  });
  const submit = () => {
    setChecked(true);
    if (valid && !join.isPending) join.mutate();
  };

  return (
    <Page contentStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
      <View style={{ gap: space.xxxl }}>
        <View style={{ gap: space.sm }}>
          <T v="titleLG">계정을 만들어요</T>
          <T muted>가입하면 동네와 반려견만 알려주시면 돼요.</T>
        </View>
        <View style={{ gap: space.md }}>
          <BigField
            placeholder="이메일"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={checked ? errors.email : undefined}
          />
          <PasswordField
            placeholder="비밀번호 (영문·숫자·특수문자 8~14자)"
            ref={passwordRef}
            autoComplete="new-password"
            passwordRules={PASSWORD_RULES}
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => confirmRef.current?.focus()}
            error={checked ? errors.password : undefined}
          />
          <PasswordField
            placeholder="비밀번호 확인"
            ref={confirmRef}
            autoComplete="new-password"
            passwordRules={PASSWORD_RULES}
            value={confirm}
            onChangeText={setConfirm}
            returnKeyType="go"
            onSubmitEditing={submit}
            error={checked ? errors.confirm : undefined}
          />
        </View>
      </View>
      <Plate title="가입하고 시작하기" onPress={submit} loading={join.isPending} />
    </Page>
  );
}
