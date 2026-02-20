"use client";

import type { GiftData } from "./store";

type CreateGiftInput = {
  topText?: string;
  bottomText?: string;
  fileExt: string;
};

type CreateGiftResponse = {
  slug: string;
  path: string;
  uploadUrl: string;
  expiresAt: string;
};

type GetGiftResponse = {
  slug: string;
  topText: string;
  bottomText: string;
  expiresAt: string;
  isExpired: boolean;
  imageUrl: string;
};

export async function createGift(input: CreateGiftInput) {
  const response = await fetch("/api/gifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Falha ao criar presente.");
  }

  return (await response.json()) as CreateGiftResponse;
}

export async function uploadToSignedUrl(file: File, uploadUrl: string) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  return { ok: response.ok as const };
}

export async function getGift(slug: string): Promise<GiftData | null> {
  const response = await fetch(`/api/gifts/${encodeURIComponent(slug)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 404 || response.status === 410) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Falha ao carregar presente.");
  }

  const data = (await response.json()) as GetGiftResponse;
  return {
    imageObjectUrl: data.imageUrl,
    topText: data.topText,
    bottomText: data.bottomText,
    showContentWarning: false,
  };
}