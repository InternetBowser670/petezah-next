import { Metadata } from "next";
import Script from "next/script";
import Particles from "@/ui/particles";
import Sidebar from "@/ui/sidebar";
import { Suspense } from "react";
import { SidebarProvider } from "@/context/sidebar-context";
import { Analytics } from "@vercel/analytics/next";
import AntiScreenshotOverlay from "@/ui/anti-screenshot-overlay";
import { Cloak } from "@/ui/cloak";
import "../globals.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "PeteZah-Next",
  description: "The next generation of PeteZah Games",
  keywords:
    "Proxy, Unblocker, Pete Zah Unblocker, Pete Zah Games, Pete Zah, Games,",
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
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-[#ededed] min-h-screen bg-[#0a0a0a]">
        <Cloak>
          <AntiScreenshotOverlay />
          <Particles />
          <Suspense>
            <SidebarProvider>
              <Sidebar>{children}</Sidebar>
            </SidebarProvider>
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
          <Analytics />
        </Cloak>
      </div>
    </>
  );
}
