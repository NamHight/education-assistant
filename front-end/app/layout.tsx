import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { storeHydration } from '@/lib/storeHydration';
import StoreHydrater from '@/components/stores/StoreHydrater';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Suspense } from 'react';
import { LinearProgress } from '@mui/material';
import { NAVIGATION } from '@/app/navigation';
import { Branding } from '@toolpad/core';
import theme from '@/theme';
import Provider from '@/components/providers/Provider';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import LoadingScreen from '@/components/loading/LoadingScreen';
import { WaveAnimationLoading } from '@/components/loading/LoadingScreenWave';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'CKC Hỗ trợ đào tạo',
  description: 'Ứng dụng hỗ trợ đào tạo của CKC',
  icons: {
    icon: '/favicon.ico'
  }
};
const BRANDING: Branding = {
  title: 'CKC Hỗ trợ đào tạo',
  homeUrl: '/',
  logo: <Image src='/assets/images/logo.png' alt='CKC Hỗ trợ đào tạo' width={40} height={50} priority />
};
export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-toolpad-color-scheme='light'>
      <body className={`antialiased`} style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <AppRouterCacheProvider options={{ enableCssLayer: true, speedy: true }}>
          <Suspense fallback={<WaveAnimationLoading />}>
            <NextAppProvider theme={theme} navigation={NAVIGATION} branding={BRANDING}>
              <Provider>{children}</Provider>
            </NextAppProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
