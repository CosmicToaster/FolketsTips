import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/context/GameContext';

export const metadata: Metadata = {
  title: 'Folkets Tips — Stryktipset',
  description: 'Generera en viktad tipsrad baserad på gruppens konsensus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
