"use client";

import { create } from "zustand";

export type GiftData = {
  imageObjectUrl: string;
  topText: string;
  bottomText: string;
  showContentWarning: boolean;
};

type GiftStore = {
  gifts: Record<string, GiftData>;
  setGift: (slug: string, gift: GiftData) => void;
  getGift: (slug: string) => GiftData | undefined;
};

export const useGiftStore = create<GiftStore>((set, get) => ({
  gifts: {},
  setGift: (slug, gift) =>
    set((state) => ({
      gifts: { ...state.gifts, [slug]: gift },
    })),
  getGift: (slug) => get().gifts[slug],
}));
