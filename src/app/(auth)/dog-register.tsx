import { View } from "react-native";
import { T } from "@/components/common/ui";
import { space } from "@/constants/theme";
import { DogForm } from "@/features/dog/DogForm";
import { saveDog } from "@/services/user";
import { useUserStore } from "@/stores/userStore";

// 서버에 저장 → onboarded=true → 루트 레이아웃 guard가 산책 홈으로 보냄
export default function DogRegisterScreen() {
  return (
    <DogForm
      submitLabel="등록하고 산책하러 가기"
      onSubmit={async (dog) => {
        await saveDog(dog);
        useUserStore.setState({ onboarded: true });
      }}
      header={
        <View style={{ gap: space.sm }}>
          <T v="titleLG">반려견을 소개해주세요</T>
          <T muted>
            공유한 코스에 견종과 나이가 함께 표시돼요.
          </T>
        </View>
      }
    />
  );
}
