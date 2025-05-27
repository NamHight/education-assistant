import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { storeHydration } from "@/lib/storeHydration";
import StoreHydrater from "@/components/stores/StoreHydrater";
import {NextAppProvider} from "@toolpad/core/nextjs";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {Suspense} from "react";
import {LinearProgress} from "@mui/material";
import {NAVIGATION} from "@/app/navigation";
import {Branding} from "@toolpad/core";
import theme from "@/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CKC Hỗ trợ đào tạo",
  description: "Ứng dụng hỗ trợ đào tạo của CKC",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  themeColor: "#000000",
  metadataBase: new URL("https://ckc.edu.vn"),
  openGraph: {
    title: "CKC Hỗ trợ đào tạo",
    description: "Ứng dụng hỗ trợ đào tạo của CKC",
    url: "https://ckc.edu.vn",
    siteName: "CKC Hỗ trợ đào tạo",
    images: [
      {
        url: "https://ckc.edu.vn/og-image.png",
        width: 1200,
        height: 630,
        alt: "CKC Hỗ trợ đào tạo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};
const BRANDING: Branding = {
  title: "Education Assistant",
  homeUrl: "/",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeHydrater = await storeHydration();
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

      <AppRouterCacheProvider  options={{enableCssLayer: true, speedy: true}}>
        <Suspense fallback={<LinearProgress />}>
          <NextAppProvider theme={theme} navigation={NAVIGATION} branding={BRANDING}>
            <StoreHydrater auth={storeHydrater.auth} setting={storeHydrater.setting}/>
            {children}
          </NextAppProvider>
        </Suspense>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
