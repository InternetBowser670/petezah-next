/* eslint-disable @next/next/no-page-custom-font */
import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Particles from "@/ui/particles";
import Sidebar from "@/ui/sidebar";
import { Suspense } from "react";
import { SidebarProvider } from '@/context/sidebar-context';

export const metadata: Metadata = {
  title: "PeteZah",
  description: "Pete Zah, game on",
  keywords: "Proxy, Unblocker, Pete Zah Unblocker, Pete Zah Games, Pete Zah",
  other: {
    "benrogo:index": "index",
    "benrogo:uvpath": "/static/uv/uv.config.js",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SHE360M0YP"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SHE360M0YP');
          `}
        </Script>

        {/* Google Ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6640595376330309"
          crossOrigin="anonymous"
        />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
        {/* eslint-disable-next-line @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        {/* Additional CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
        />
      </head>
      <body className="text-[#ededed] h-full bg-[#0a0a0a]">
        <Particles />
        <Suspense>
          <SidebarProvider><Sidebar>{children}</Sidebar></SidebarProvider>
        </Suspense>

        {/* changelog */}

        <Script id="changelogfy-config">
        {`
            let CLF_config = {
              app_id: "03599c7b-79db-4651-8efa-90e18b54dabf",
              data: {
                  user_id: '123456',
                  user_email: 'user@email.com',
                  user_name: 'User Name',
                  custom_data: {
                      'JobRole': 'CEO',
                      'Plan': 'Pro',
                      'teamMates': '4',
                      'MonthlySpend': '50 USD'
                  }
              }
            };
          `}
      </Script>
      <Script async src="https://widget.changelogfy.com/index.js" />
      </body>
    </html>
  );
}
