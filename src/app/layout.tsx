import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ManuVerse | Smart Factory Platform",
  description:
    "ManuVerse is an enterprise-grade Smart Factory platform for real-time production monitoring, predictive maintenance, quality control, and supply chain orchestration.",
  keywords: [
    "smart factory",
    "manufacturing",
    "MES",
    "IoT",
    "industry 4.0",
    "predictive maintenance",
    "ManuVerse",
  ],
  authors: [{ name: "Rohit Jha" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text-primary)",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
