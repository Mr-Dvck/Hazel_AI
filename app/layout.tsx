import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hazel_AI | Your Empathetic Sanctuary & Creative Confidante',
  description:
    'A warm, deeply empathetic, 100% judgment-free companion AI and Resilience Milestone Tower for Hazel.',
  keywords: ['Hazel_AI', 'Empathetic Companion', 'Resilience Tower', 'Creative AI'],
  authors: [{ name: 'Hazel_AI Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07070b] text-gray-100 antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
