import { useState, type ReactNode } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid, type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Field, I, Num, Page, PhotoTile, Plate, Segmented, T } from "@/components/common/ui";
import { radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Dog, DogSize } from "@/types/dog";
import { dotDate, isoDate } from "@/utils/format";

const SIZES = ["소형", "중형", "대형"] as const;

type Props = { initial?: Dog | null; submitLabel: string; onSubmit: (dog: Dog) => void; header?: ReactNode };

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// 온보딩 반려견 등록 / 마이 반려견 프로필 수정 공용
export function DogForm({ initial, submitLabel, onSubmit, header }: Props) {
  const c = useTheme();
  const [name, setName] = useState(initial?.name ?? "");
  const [breed, setBreed] = useState(initial?.breed ?? "");
  const [size, setSize] = useState<DogSize>(initial?.size ?? "소형");
  const [birth, setBirth] = useState(initial?.birth ?? "");
  const [picking, setPicking] = useState(false);

  const pickerDate = birth ? parseIso(birth) : new Date(new Date().getFullYear() - 2, 0, 1);
  const onPick = (_: DateTimePickerEvent, d?: Date) => {
    if (d) setBirth(isoDate(d));
  };
  const openPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({ value: pickerDate, mode: "date", maximumDate: new Date(), onChange: onPick });
    } else {
      setPicking(!picking);
    }
  };

  const submit = () => {
    if (!name.trim() || !breed.trim()) return Alert.alert("이름과 견종을 입력해주세요.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return Alert.alert("생년월일을 선택해주세요.");
    onSubmit({ name: name.trim(), breed: breed.trim(), size, birth });
  };

  return (
    <Page>
      {header}
      <View style={s.avatarWrap}>
        {/* ponytail: 이미지 자리만. expo-image-picker 연결 시 교체 */}
        <PhotoTile icon={I.addPhoto} style={s.avatar} />
        <T v="bodySmall" w="medium" muted>
          프로필 사진
        </T>
      </View>
      <View style={{ gap: space.lg }}>
        <Field label="이름" value={name} onChangeText={setName} placeholder="콩이" />
        <Field label="견종" value={breed} onChangeText={setBreed} placeholder="포메라니안" />
        <View style={{ gap: space.sm }}>
          <T v="bodySmall" w="medium" muted>
            크기
          </T>
          <Segmented options={SIZES} value={size} onChange={setSize} />
        </View>
        {Platform.OS === "web" ? (
          // 웹에는 시스템 날짜 선택기가 없다
          <Field label="생년월일" value={birth} onChangeText={setBirth} placeholder="2023-05-01" maxLength={10} />
        ) : (
          <View style={{ gap: space.sm }}>
            <T v="bodySmall" w="medium" muted>
              생년월일
            </T>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={birth ? `생년월일 ${dotDate(birth)}, 변경` : "생년월일 선택"}
              onPress={openPicker}
              style={[s.dateField, { backgroundColor: picking ? c.surface : c.surfaceMuted, borderColor: picking ? c.textPrimary : "transparent" }]}
            >
              {birth ? <Num size={16}>{dotDate(birth)}</Num> : <T muted>날짜를 선택해주세요</T>}
            </Pressable>
            {picking && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="inline"
                locale="ko-KR"
                maximumDate={new Date()}
                accentColor={c.textPrimary}
                onChange={onPick}
              />
            )}
          </View>
        )}
      </View>
      <Plate title={submitLabel} onPress={submit} />
    </Page>
  );
}

const s = StyleSheet.create({
  avatarWrap: { alignItems: "center", gap: space.sm },
  avatar: { width: 112, height: 112, borderRadius: radius.pill },
  dateField: { minHeight: 52, borderRadius: radius.input, borderWidth: 1.5, paddingHorizontal: space.lg, justifyContent: "center" },
});
