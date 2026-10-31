import { useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, I, Icon, Logo, T } from "@/components/common/ui";
import { gutter, radius, space } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { MIXED, searchBreeds } from "./breeds";

type Props = { visible: boolean; value: string; onClose: () => void; onPick: (breed: string) => void };

// 견종은 실제 있는 이름만 고르게 한다. 목록에 없으면 믹스견/기타
export function BreedSheet({ visible, value, onClose, onPick }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState("");
  const hits = searchBreeds(q);

  const close = () => {
    setQ("");
    onClose();
  };
  const pick = (breed: string) => {
    onPick(breed);
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      {/* iOS 시트는 상태 표시줄 아래에서 시작하고, 안드로이드·웹은 전체 화면이라 위 여백을 직접 둔다 */}
      <View style={{ flex: 1, backgroundColor: c.background, paddingTop: Platform.OS === "ios" ? 0 : insets.top }}>
        <View style={s.header}>
          <View style={s.side} />
          <T v="bodyMain">견종</T>
          <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={close} style={s.side}>
            <Icon name={I.close} size={20} />
          </Pressable>
        </View>

        <View style={s.search}>
          <Field
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="견종 이름을 입력해주세요"
            accessibilityLabel="견종 검색"
            returnKeyType="search"
            autoCorrect={false}
            style={{ paddingRight: 48 }}
          />
          <View pointerEvents="none" style={s.searchIcon}>
            <Icon name={I.search} size={18} color={c.textSecondary} />
          </View>
        </View>

        {hits.length ? (
          <FlatList
            data={hits}
            keyExtractor={(b) => b}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: insets.bottom + space.xl }}
            ItemSeparatorComponent={Sep}
            renderItem={({ item }) => <BreedRow name={item} q={q.trim()} on={item === value} onPress={() => pick(item)} />}
          />
        ) : (
          <View style={s.empty}>
            <Logo size={80} color={c.borderStrong} />
            <T v="bodySmall" muted center>
              {q.trim() ? `'${q.trim()}'에 맞는 견종이 없어요.` : "자주 키우는 견종 중에서 찾을 수 있어요."}
              {"\n"}목록에 없으면 믹스견/기타를 골라주세요.
            </T>
            <MixedButton on={value === MIXED} onPress={() => pick(MIXED)} />
          </View>
        )}
      </View>
    </Modal>
  );
}

// 검색어와 맞는 부분만 Chew Brown으로
function BreedRow({ name, q, on, onPress }: { name: string; q: string; on: boolean; onPress: () => void }) {
  const c = useTheme();
  const i = q ? name.indexOf(q) : -1;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && { backgroundColor: c.surfaceMuted }]}
    >
      <T style={{ flex: 1 }} numberOfLines={1}>
        {i < 0 ? (
          name
        ) : (
          <>
            {name.slice(0, i)}
            <T w="semibold" color={c.primaryDeep}>
              {name.slice(i, i + q.length)}
            </T>
            {name.slice(i + q.length)}
          </>
        )}
      </T>
      {on && <Icon name={I.check} size={20} color={c.primaryDeep} />}
    </Pressable>
  );
}

function Sep() {
  const c = useTheme();
  return <View style={[s.sep, { backgroundColor: c.borderSubtle }]} />;
}

// 테두리 버튼. 골라 둔 상태면 Cream Beige + Chew Yellow 테두리
function MixedButton({ on, onPress }: { on: boolean; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={({ pressed }) => [
        s.mixed,
        { backgroundColor: on || pressed ? c.primarySoft : c.surface, borderColor: on ? c.primary : c.borderStrong },
      ]}
    >
      <T v="bodySmall" w="semibold" color={on ? c.primaryDeep : c.textPrimary}>
        믹스견/기타
      </T>
    </Pressable>
  );
}

const s = StyleSheet.create({
  header: { height: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.sm },
  side: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  search: { paddingHorizontal: gutter, paddingBottom: space.sm },
  searchIcon: { position: "absolute", right: gutter + space.lg, top: 0, bottom: space.sm, justifyContent: "center" },
  row: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: space.md, paddingHorizontal: gutter },
  sep: { height: StyleSheet.hairlineWidth, marginLeft: gutter },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.lg, paddingHorizontal: space.xxl, paddingBottom: 120 },
  mixed: { minHeight: 44, paddingHorizontal: space.xl, borderRadius: radius.chip, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
