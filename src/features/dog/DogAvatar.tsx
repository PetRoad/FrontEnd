import { View } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/useTheme";

// 반려견 프로필 사진. 고른 사진이 없으면 강아지 얼굴 그림(assets/images/dog-default.svg)으로 기본 프로필
export function DogAvatar({ photo, size }: { photo?: string; size: number }) {
  const c = useTheme();
  const round = { width: size, height: size, borderRadius: size / 2 };
  if (photo) return <Image source={{ uri: photo }} contentFit="cover" style={round} />;
  return (
    <View style={[round, { backgroundColor: c.borderSubtle, alignItems: "center", justifyContent: "center" }]}>
      <Image source={require("@/assets/images/dog-default.svg")} contentFit="contain" style={round} />
    </View>
  );
}
