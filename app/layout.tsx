import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Providers } from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FinanceHub - Treasury Dashboard",
  description: "Enterprise financial analytics and risk management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
