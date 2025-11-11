import Header from "../../components/Header/Navbar";
import "@/app/globals.css";
import { Geist } from "next/font/google";

const geist = Geist({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`${geist.variable}`}>
      <Header query="" />
      {children}
    </main>
  );
}
