"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import { get, set, del } from "idb-keyval";

import { uuid } from "./uuid";
import easyInside from "@/data/easyInside.json";
import easyOutside from "@/data/easyOutside.json";
import mediumInside from "@/data/mediumInside.json";
import mediumOutside from "@/data/mediumOutside.json";
import hardInside from "@/data/hardInside.json";
import hardOutside from "@/data/hardOutside.json";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export type ScavvyGame = {
  id: string;
  location: "inside" | "outside";
  difficulty: "easy" | "medium" | "hard";
  date: string;
  items: Array<{
    id: string;
    name: string;
    difficulty: "easy" | "medium" | "hard";
    found: boolean;
    photo?: string;
  }>;
};

export type PersistantStore = {
  allItems: Array<{
    id: string;
    name: string;
    difficulty: "easy" | "medium" | "hard";
    location: "inside" | "outside";
  }>;
  activeGame: ScavvyGame | null;
  setActiveGame: (game: PersistantStore["activeGame"]) => void;
  markItemFound: (itemId: string) => void;
  addItemPhoto: (itemId: string, photo: string) => void;
  deleteItemPhoto: (itemId: string) => void;
  clearActiveGame: () => void;
  previousGames: ScavvyGame[];
  addPreviousGame: (game: PersistantStore["activeGame"]) => void;
  updatePreviousGame: (game: PersistantStore["activeGame"]) => void;
  removePreviousGame: (game: PersistantStore["activeGame"]) => void;
};

export const usePersistantStore = create(
  persist<PersistantStore>(
    (set, get) => ({
      allItems: [
        ...easyInside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "easy" as const,
          location: "inside" as const,
        })),
        ...easyOutside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "easy" as const,
          location: "outside" as const,
        })),
        ...mediumInside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "medium" as const,
          location: "inside" as const,
        })),
        ...mediumOutside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "medium" as const,
          location: "outside" as const,
        })),
        ...hardInside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "hard" as const,
          location: "inside" as const,
        })),
        ...hardOutside.map((item) => ({
          id: uuid(),
          name: item.name,
          difficulty: "hard" as const,
          location: "outside" as const,
        })),
      ],
      activeGame: null,
      setActiveGame: (game: ScavvyGame | null) => {
        if (game?.id === get().activeGame?.id) return;
        set({ activeGame: game ? { ...game, id: game.id } : null });

        const previousGame = get().previousGames.find(
          (prevGame) => prevGame.id === game?.id
        );

        if (!previousGame && game) {
          const newPreviousGames = [...get().previousGames, game];
          set({ previousGames: newPreviousGames });
        }
      },
      markItemFound: (itemId) =>
        set((state) => {
          if (!state.activeGame) return state;
          return {
            activeGame: {
              ...state.activeGame,
              items: state.activeGame.items.map((item) =>
                item.id === itemId ? { ...item, found: !item.found } : item
              ),
            },
          };
        }),
      addItemPhoto: (itemId, photo) =>
        set((state) => {
          if (!state.activeGame) return state;
          return {
            activeGame: {
              ...state.activeGame,
              items: state.activeGame.items.map((item) =>
                item.id === itemId ? { ...item, photo } : item
              ),
            },
          };
        }),
      deleteItemPhoto: (itemId) =>
        set((state) => {
          if (!state.activeGame) return state;
          return {
            activeGame: {
              ...state.activeGame,
              items: state.activeGame.items.map((item) =>
                item.id === itemId ? { ...item, photo: undefined } : item
              ),
            },
          };
        }),
      clearActiveGame: () => set({ activeGame: null }),

      previousGames: [],
      addPreviousGame: (game) =>
        set((state) => {
          if (!game) return state;
          return {
            previousGames: [
              ...state.previousGames,
              { ...game, id: game.id || uuid() },
            ],
          };
        }),
      updatePreviousGame: (game) =>
        set((state) => {
          if (!game) return state;
          return {
            previousGames: state.previousGames.map((prevGame) =>
              prevGame.id === game.id ? game : prevGame
            ),
          };
        }),
      removePreviousGame: (game) =>
        set((state) => {
          if (!game) return state;
          return {
            previousGames: state.previousGames.filter(
              (prevGame) => prevGame.id !== game.id
            ),
          };
        }),
    }),
    {
      name: "scavenger-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);
