import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Btn, Field, I, MapPlate, Page, Plate, Steps, T } from "@/components/common/ui";
import { useUserStore } from "@/stores/userStore";

export default function RegionScreen() {
  const [region, setRegion] = useState(useUserStore.getState().region);

  const next = () => {
    if (!region.trim()) return Alert.alert("동네를 알려주세요.", "현재 위치로 설정하거나 직접 입력할 수 있어요.");
    useUserStore.setState({ region: region.trim() });
    router.push("/dog-register");
  };

  return (
    <Page>
      <Steps step={1} total={2} />
      <View style={{ gap: 6 }}>
        <T v="title1">우리 동네를 알려주세요</T>
        <T v="subhead" muted>
          추천 코스는 이 동네 기준으로 보여드려요.
        </T>
      </View>
      <MapPlate style={s.map} marker />
      <View style={{ gap: 16 }}>
        {/* ponytail: 고정값. expo-location reverseGeocodeAsync로 교체 */}
        <Btn title="현재 위치로 설정" icon={I.locate} onPress={() => setRegion("서울시 성북구")} />
        <Field label="동네" value={region} onChangeText={setRegion} placeholder="서울시 성북구" />
      </View>
      <Plate title="다음" onPress={next} />
    </Page>
  );
}

const s = StyleSheet.create({
  map: { height: 200, borderRadius: 16 },
});
