import { router } from "expo-router";
import { DogForm } from "@/features/dog/DogForm";
import { useUserStore } from "@/stores/userStore";

export default function DogProfileScreen() {
  const dog = useUserStore((s) => s.dog);
  return (
    <DogForm
      initial={dog}
      submitLabel="저장"
      onSubmit={(next) => {
        useUserStore.setState({ dog: next });
        router.back();
      }}
    />
  );
}
