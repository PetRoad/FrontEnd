import { create } from "zustand";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type WalkState = {
  isWalking: boolean;
  coordinates: Coordinate[];

  startWalk: () => void;
  endWalk: () => void;
  addCoordinate: (coordinate: Coordinate) => void;
};

export const useWalkStore = create<WalkState>((set) => ({
  isWalking: false,
  coordinates: [],

  startWalk: () =>
    set({
      isWalking: true,
      coordinates: [],
    }),

  endWalk: () =>
    set({
      isWalking: false,
    }),

  addCoordinate: (coordinate) =>
    set((state) => ({
      coordinates: [...state.coordinates, coordinate],
    })),
}));
