import { TranscriptionProvider } from '@/contexts/transcription';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TranscriptionAi',
  description: 'Um transcritor básico de vídeo/áudio para texto',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(fontSans.variable)}>
        <ThemeProvider>
          <TranscriptionProvider>
            <Toaster
              richColors
              expand
              closeButton
              theme="dark"
              toastOptions={{
                style: {
                  willChange: 'unset',
                },
              }}
            />

            {children}
          </TranscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
