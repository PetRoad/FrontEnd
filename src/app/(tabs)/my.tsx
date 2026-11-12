import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Group, I, Icon, Page, Row, Stat, T } from "@/components/common/ui";
import { radius, space } from "@/constants/theme";
import { DogAvatar } from "@/features/dog/DogAvatar";
import { WithdrawModal } from "@/features/user/WithdrawModal";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/services/auth";
import { useStats } from "@/services/user";
import { useUserStore } from "@/stores/userStore";
import { ageFromBirth, floorKm } from "@/utils/format";

export default function MyScreen() {
  const c = useTheme();
  const [withdrawing, setWithdrawing] = useState(false);
  const insets = useSafeAreaInsets();
  const { dog, region, email } = useUserStore();
  const { data: stats } = useStats();

  return (
    // iOS는 contentInsetAdjustmentBehavior가 상단 안전영역을 자동으로 더해준다
    <Page contentStyle={{ paddingTop: Platform.OS === "ios" ? space.sm : insets.top + space.sm }}>
      <T v="titleXL">마이</T>

      {/* 큰 프로필 카드 하나 + 함께 걸은 기록 두 칸 */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dog?.name ?? "반려견"} 프로필 수정`}
        onPress={() => router.push("/my/dog")}
        style={({ pressed }) => [s.profile, { backgroundColor: c.surface, borderColor: c.borderSubtle, opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={s.head}>
          <DogAvatar photo={dog?.photo} size={64} />
          <View style={{ flex: 1, gap: 2 }}>
            <T v="heading" numberOfLines={1}>
              {dog?.name}
            </T>
            <T v="bodySmall" muted numberOfLines={1}>
              {dog?.breed} · {dog?.size} · {dog ? ageFromBirth(dog.birth) : 0}살
            </T>
            <View style={s.region}>
              <Icon name={I.home} size={12} color={c.textSecondary} />
              <T v="caption" muted numberOfLines={1}>
                {region}
              </T>
            </View>
          </View>
          <Icon name={I.chevron} size={14} color={c.textTertiary} />
        </View>
        <View style={s.bento}>
          <View style={[s.cell, { backgroundColor: c.surfaceMuted }]}>
            <Stat value={stats ? String(stats.walkCount) : "-"} unit="번" label="함께 걸은 횟수" size={24} />
          </View>
          <View style={[s.cell, { backgroundColor: c.surfaceMuted }]}>
            <Stat value={stats ? floorKm(stats.totalDistanceMeters / 1000) : "-"} unit="km" label="함께 걸은 거리" size={24} />
          </View>
        </View>
      </Pressable>

      <Group header="내 산책">
        <Row icon={I.log} title="산책일지" detail={stats?.walkCount} onPress={() => router.push("/my/walks")} />
        <Row icon={I.album} title="산책 앨범" detail={stats?.photoCount} onPress={() => router.push("/my/album")} />
        <Row icon={I.map} title="내가 만든 코스" detail={stats?.courseCount} onPress={() => router.push("/my/courses")} />
        <Row icon={I.heart} title="좋아요한 코스" detail={stats?.likedCourseCount} onPress={() => router.push("/my/likes")} />
      </Group>

      {/* 회원탈퇴는 되돌릴 수 없어 묶음 밖에 한 단계 약하게 둔다 */}
      <View style={{ gap: space.xs }}>
        <Group header="계정">
          <Row icon={I.mail} title={email} sub="로그인한 계정" />
          <Row icon={I.logout} title="로그아웃" onPress={logout} arrow={false} />
        </Group>
        <Pressable
          accessibilityRole="button"
          onPress={() => setWithdrawing(true)}
          hitSlop={{ left: space.sm, right: space.sm }}
          style={({ pressed }) => [s.withdraw, pressed && { backgroundColor: c.surfaceMuted }]}
        >
          <T v="bodySmall" w="medium" muted>
            회원탈퇴
          </T>
        </Pressable>
      </View>
      <WithdrawModal visible={withdrawing} onClose={() => setWithdrawing(false)} />
    </Page>
  );
}

const s = StyleSheet.create({
  profile: { borderRadius: radius.cardLg, borderWidth: 1, padding: space.xl, gap: space.lg },
  head: { flexDirection: "row", alignItems: "center", gap: space.lg },
  region: { flexDirection: "row", alignItems: "center", gap: space.xs, marginTop: 2 },
  bento: { flexDirection: "row", gap: space.sm },
  cell: { flex: 1, borderRadius: radius.button, padding: space.lg },
  withdraw: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center", paddingHorizontal: space.sm, borderRadius: radius.chip },
});
