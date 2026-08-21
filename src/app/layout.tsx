import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PTalk 合作夥伴計劃',
  description: '透過專屬推薦連結推廣 PTalk 旗下 App，依當月銷售金額分潤，最高 30%。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW">
      <body className="bg-bg text-ink">{children}</body>
    </html>
  );
}
