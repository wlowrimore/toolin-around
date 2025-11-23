import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/AppSessionProvider";
import { Toaster } from "@/app/(root)/components/ui/toaster";

const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toolin' Around",
  description: "A barterring platform for tool sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppSessionProvider>
          {children}
          <Toaster />
        </AppSessionProvider>
      </body>
    </html>
  );
}
