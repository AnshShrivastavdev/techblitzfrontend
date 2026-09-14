import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "TechBlitz '26 // Cosmos Jabalpur Engineering College",
  description:
    'Flagship space science, robotics, IoT, and AI symposium organized by Cosmos Guild at Jabalpur Engineering College (JEC). 6 technical domains, 24-hour national hackathon, and verified credentials.',
  keywords: [
    'TechBlitz',
    'Cosmos JEC',
    'Jabalpur Engineering College',
    'Space Science',
    'Embedded Systems',
    'Robotics',
    'Hackathon',
  ],
  authors: [{ name: 'Cosmos JEC' }],
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-black text-neutral-100`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-100 selection:bg-white selection:text-black">
        <SmoothScroll>
          <AuthProvider>{children}</AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
