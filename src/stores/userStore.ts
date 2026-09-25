import { create } from "zustand";
import type { Dog } from "@/types/dog";

type UserState = {
  onboarded: boolean;
  region: string;
  dog: Dog | null;
};

export const useUserStore = create<UserState>()(() => ({
  onboarded: false,
  region: "",
  dog: null,
}));
