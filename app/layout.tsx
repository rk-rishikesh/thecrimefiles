import type { Metadata } from "next";
import { Oswald, Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppKitProvider } from "./providers/appkit-provider";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Crime Files",
  description: "nteractive crime mystery game",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Crime Files",
    description: "Interactive crime mystery game",
    url: "https://crimefiles.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${lato.variable} ${playfair.variable} antialiased`}
      >
        <AppKitProvider>{children}</AppKitProvider>
      </body>
    </html>
  );
}
