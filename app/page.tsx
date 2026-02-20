import Link from "next/link";
import { HomePreview } from "@/components/HomePreview";

export default function Home() {
  return (
    <main className="app-shell mx-auto flex w-full max-w-5xl items-center justify-center">
      <section className="card-soft grid w-full gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-black/20 bg-white px-3 py-1 text-sm font-semibold">
            Presente meme instantaneo
          </p>
          <h1 className="text-6xl leading-none md:text-7xl">Abra e boom</h1>
          <p className="max-w-xl text-lg text-black/75">
            Monte um presente com foto e frases estilo meme, gere um link e
            entregue com animacao de caixa e confete.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/criar"
              className="focusable rounded-full bg-[var(--accent)] px-6 py-3 text-base font-extrabold text-white transition hover:bg-[var(--accent-strong)]"
            >
              Criar presente
            </Link>
            <Link
              href="/p/exemplo"
              className="focusable rounded-full border-2 border-black/20 bg-white px-6 py-3 text-base font-bold transition hover:-translate-y-0.5"
            >
              Ver exemplo
            </Link>
          </div>
        </div>
        <div className="card-soft flex min-h-[260px] items-center justify-center bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 p-6 overflow-hidden">
          <HomePreview />
        </div>
      </section>
    </main>
  );
}
