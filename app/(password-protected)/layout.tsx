/* eslint-disable @next/next/no-page-custom-font */
import { Metadata } from "next";
import Particles from "@/ui/particles";
import Sidebar from "@/ui/sidebar";
import { Suspense } from "react";
import { SidebarProvider } from "@/context/sidebar-context";
import { Analytics } from "@vercel/analytics/next";
import AntiScreenshotOverlay from "@/ui/anti-screenshot-overlay";
import { Cloak } from "@/ui/cloak";
import "../globals.css";
import Head from "next/head";
import { geistMono } from "@/lib/fonts";
import { CookiesProvider } from "next-client-cookies/server";
import { SupabaseAuthListener } from "@/ui/client-providers";
import SettingsProvider from "@/ui/settings-manager";

export const metadata: Metadata = {
  description: "The next generation of PeteZah, privacy tool",
  keywords: `
    security, privacy, student privacy, digital safety,
    education, learning, teaching, curriculum, classroom technology, study tools, academic resources,
    school, public school, private school, K-12, primary school, secondary school, high school,
    higher education, university, college, degree, diploma, academic success,
    online learning, e-learning, distance education, remote learning, virtual classroom, digital learning, education software, learning platform
  `,
  other: {
    "benrogo:index": "index",
    "benrogo:uvpath": "/static/uv/uv.config.js",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SupabaseAuthListener />
      <Head>
        <title key="title">PeteZah-Next</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className={`text-[#ededed] min-h-screen bg-[#0a0a0a] ${geistMono.className}`}
      >
        <Cloak>
          <AntiScreenshotOverlay />
          <Particles />
          <SettingsProvider>
            <Suspense>
              <CookiesProvider>
                <SidebarProvider>
                  <Sidebar>{children}</Sidebar>
                </SidebarProvider>
              </CookiesProvider>
            </Suspense>
          </SettingsProvider>

          {/* changelog <Script id="changelogfy-config">
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
          <Script async src="https://widget.changelogfy.com/index.js" /> */}

          <Analytics />
        </Cloak>
      </div>
    </>
  );
}
