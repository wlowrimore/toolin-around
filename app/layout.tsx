import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/AppSessionProvider";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
      <body className={`${poppins.variable}`}>
        <AppSessionProvider>
          {children}
          <Toaster />
        </AppSessionProvider>
      </body>
    </html>
  );
}
