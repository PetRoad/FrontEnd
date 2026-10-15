import { View } from "react-native";
import { Steps, T } from "@/components/common/ui";
import { space } from "@/constants/theme";
import { DogForm } from "@/features/dog/DogForm";
import { useUserStore } from "@/stores/userStore";

// 등록 완료 → onboarded=true → 루트 레이아웃 guard가 산책 홈으로 보냄
export default function DogRegisterScreen() {
  return (
    <DogForm
      submitLabel="등록하고 산책하러 가기"
      onSubmit={(dog) => useUserStore.setState({ dog, onboarded: true })}
      header={
        <>
          <Steps step={2} total={2} />
          <View style={{ gap: space.sm }}>
            <T v="titleLG">반려견을 소개해주세요</T>
            <T muted>
              공유한 코스에 견종과 나이가 함께 표시돼요.
            </T>
          </View>
        </>
      }
    />
  );
}
