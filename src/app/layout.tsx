import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "TranscriptionAi",
  description: "Um transcritor básico de vídeo/áudio para texto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(fontSans.variable)}>{children}</body>
    </html>
  );
}
