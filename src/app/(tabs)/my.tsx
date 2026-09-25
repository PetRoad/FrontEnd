import { Platform, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Group, I, Icon, Page, Row, T, shadow } from "@/components/common/ui";
import { useTheme } from "@/hooks/useTheme";
import { useCourseStore } from "@/stores/courseStore";
import { useUserStore } from "@/stores/userStore";
import { useWalkStore } from "@/stores/walkStore";
import { ageFromBirth } from "@/utils/format";

export default function MyScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { dog, region } = useUserStore();
  const walks = useWalkStore((s) => s.walks);
  const courses = useCourseStore((s) => s.courses);
  const likedCount = useCourseStore((s) => s.liked.length);
  const photoCount = walks.reduce((n, w) => n + w.photos.length, 0);
  const totalKm = walks.reduce((n, w) => n + w.distanceKm, 0);

  return (
    // iOS는 contentInsetAdjustmentBehavior가 상단 안전영역을 자동으로 더해준다
    <Page contentStyle={{ paddingTop: Platform.OS === "ios" ? 8 : insets.top + 8 }}>
      <T v="largeTitle">마이</T>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dog?.name ?? "반려견"} 프로필 수정`}
        onPress={() => router.push("/my/dog")}
        style={({ pressed }) => [s.profile, { backgroundColor: c.surface, opacity: pressed ? 0.85 : 1 }, shadow]}
      >
        {/* 프로필 사진 연결 전까지 iOS 연락처처럼 이름 첫 글자 */}
        <View style={[s.avatar, { backgroundColor: c.tile }]}>
          <T v="title2" muted>
            {dog?.name.slice(0, 1)}
          </T>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="title3" numberOfLines={1}>
            {dog?.name}
          </T>
          <T v="subhead" muted numberOfLines={1}>
            {dog?.breed} · {dog?.size} · {dog ? ageFromBirth(dog.birth) : 0}살
          </T>
          <View style={s.region}>
            <Icon name={I.pin} size={12} color={c.inkMuted} />
            <T v="footnote" muted numberOfLines={1}>
              {region}
            </T>
          </View>
          <T v="footnote" muted>
            {walks.length}번, {totalKm.toFixed(1)}km 함께 걸었어요
          </T>
        </View>
        <Icon name={I.chevron} size={14} color={c.inkMuted} />
      </Pressable>

      <Group header="내 산책">
        <Row icon={I.log} title="산책일지" detail={walks.length} onPress={() => router.push("/my/walks")} />
        <Row icon={I.album} title="산책 앨범" detail={photoCount} onPress={() => router.push("/my/album")} />
        <Row icon={I.map} title="내가 만든 코스" detail={courses.filter((x) => x.mine).length} onPress={() => router.push("/my/courses")} />
        <Row icon={I.heart} title="좋아요한 코스" detail={likedCount} onPress={() => router.push("/my/likes")} />
      </Group>
    </Page>
  );
}

const s = StyleSheet.create({
  profile: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  region: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
});
