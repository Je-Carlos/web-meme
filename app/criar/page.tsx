"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createGift, uploadToSignedUrl } from "@/lib/gift-api";
import { useGiftStore } from "@/lib/store";

const MAX_BYTES = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function validateImage(file: File) {
  if (!VALID_TYPES.includes(file.type)) {
    return "Use apenas JPG, PNG ou WEBP.";
  }
  if (file.size > MAX_BYTES) {
    return "Arquivo maior que 5MB.";
  }
  return null;
}

export default function CriarPage() {
  const router = useRouter();
  const setGift = useGiftStore((state) => state.setGift);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [topText, setTopText] = useState("nos");
  const [bottomText, setBottomText] = useState("");
  const [showContentWarning, setShowContentWarning] = useState(true);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const canSubmit = useMemo(
    () => Boolean(file && !loading && !error),
    [error, file, loading],
  );

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    const validation = validateImage(selected);
    if (validation) {
      setError(validation);
      setFile(null);
      setPreviewUrl("");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setError("");
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !previewUrl || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fileExt = file.name.split(".").pop() ?? "";
      const { slug, uploadUrl } = await createGift({
        topText,
        bottomText,
        fileExt,
      });

      const uploadResult = await uploadToSignedUrl(file, uploadUrl);
      if (!uploadResult.ok) {
        throw new Error("Falha no upload.");
      }

      setGift(slug, {
        imageObjectUrl: previewUrl,
        topText: topText.trim() || "nos",
        bottomText: bottomText.trim(),
        showContentWarning,
      });

      router.push(`/p/${slug}`);
    } catch {
      setError("Nao foi possivel gerar o link agora. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <main className="app-shell mx-auto flex w-full max-w-5xl items-center justify-center">
      <section className="card-soft w-full max-w-2xl p-6 md:p-8">
        <h1 className="text-5xl leading-none md:text-6xl">Criar presente</h1>
        <p className="mt-2 text-black/70">
          Escolha a imagem, ajuste os textos e gere o link para abrir a caixa.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold">
            Imagem
            <input
              aria-label="Selecionar imagem do presente"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="focusable mt-2 block w-full rounded-xl border-2 border-black/20 bg-white p-3 text-sm"
            />
          </label>

          <div className="overflow-hidden rounded-2xl border-2 border-dashed border-black/20 bg-white/70 p-3">
            {previewUrl ? (
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image
                  src={previewUrl}
                  alt="Preview do meme"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-sm font-semibold text-black/60">
                Preview da imagem aparece aqui
              </div>
            )}
          </div>

          <label className="block text-sm font-bold">
            Texto grande (max 60)
            <input
              aria-label="Texto grande"
              maxLength={60}
              value={topText}
              onChange={(event) => setTopText(event.target.value)}
              className="focusable mt-2 block w-full rounded-xl border-2 border-black/20 bg-white p-3"
            />
          </label>

          <label className="block text-sm font-bold">
            Texto pequeno (max 120)
            <input
              aria-label="Texto pequeno"
              maxLength={120}
              value={bottomText}
              onChange={(event) => setBottomText(event.target.value)}
              className="focusable mt-2 block w-full rounded-xl border-2 border-black/20 bg-white p-3"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border-2 border-black/15 bg-white/80 p-3 font-semibold">
            <input
              aria-label="Mostrar aviso de conteudo"
              type="checkbox"
              checked={showContentWarning}
              onChange={(event) => setShowContentWarning(event.target.checked)}
              className="h-4 w-4 accent-orange-600"
            />
            Mostrar aviso de conteudo
          </label>

          {error ? (
            <p className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <button
            aria-label="Gerar link do presente"
            type="submit"
            disabled={!canSubmit}
            className="focusable w-full rounded-full bg-[var(--accent)] px-6 py-3 text-base font-extrabold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gerando..." : "Gerar link"}
          </button>
        </form>
      </section>
    </main>
  );
}