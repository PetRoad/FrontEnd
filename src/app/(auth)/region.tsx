import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { MapPlate } from "@/components/common/MapPlate";
import { Btn, Field, I, Page, Plate, Steps, T } from "@/components/common/ui";
import { radius, space } from "@/constants/theme";
import { useUserStore } from "@/stores/userStore";
import { here } from "@/utils/location";

export default function RegionScreen() {
  const [region, setRegion] = useState(useUserStore.getState().region);

  const next = () => {
    if (!region.trim()) return Alert.alert("동네를 알려주세요.", "현재 위치로 설정하거나 직접 입력할 수 있어요.");
    useUserStore.setState({ region: region.trim() });
    router.push("/dog-register");
  };

  const locate = async () => {
    const p = await here();
    if (!p) return Alert.alert("현재 위치를 알 수 없어요.", "위치 권한과 위치 서비스를 켜거나 동네를 직접 입력해 주세요.");
    const [a] = await Location.reverseGeocodeAsync(p).catch(() => []);
    // 예: 서울특별시 성북구 정릉동. 나라마다 칸이 겹쳐 오기도 해서 중복은 뺀다
    if (a) setRegion([...new Set([a.region, a.city, a.district].filter(Boolean))].join(" "));
  };

  return (
    <Page>
      <Steps step={1} total={2} />
      <View style={{ gap: space.sm }}>
        <T v="titleLG">우리 동네를 알려주세요</T>
        <T muted>
          추천 코스는 이 동네 기준으로 보여드려요.
        </T>
      </View>
      <MapPlate style={s.map} marker />
      <View style={{ gap: space.lg }}>
        <Btn title="현재 위치로 설정" icon={I.locate} onPress={locate} />
        <Field label="동네" value={region} onChangeText={setRegion} placeholder="서울시 성북구" />
      </View>
      <Plate title="다음" onPress={next} />
    </Page>
  );
}

const s = StyleSheet.create({
  map: { height: 200, borderRadius: radius.card },
});
