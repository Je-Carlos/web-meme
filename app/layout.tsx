import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tcharã",
  description: "Monte um presente com foto e frases estilo meme, gere um link e entregue com animação de caixa e confete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
