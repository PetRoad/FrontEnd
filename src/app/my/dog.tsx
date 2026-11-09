import { router } from "expo-router";
import { DogForm } from "@/features/dog/DogForm";
import { saveDog } from "@/services/user";
import { useUserStore } from "@/stores/userStore";

export default function DogProfileScreen() {
  const dog = useUserStore((s) => s.dog);
  return (
    <DogForm
      initial={dog}
      submitLabel="저장"
      onSubmit={async (next) => {
        await saveDog(next);
        router.back();
      }}
    />
  );
}
