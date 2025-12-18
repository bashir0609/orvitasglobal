import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orvitasglobal.com"),
  title: {
    default: "OrvitasGlobal | Premier Student Consultancy",
    template: "%s | OrvitasGlobal",
  },
  description: "Expert guidance for students aspiring to study in the UK, Europe, Canada, and Australia.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://orvitasglobal.com",
    siteName: "OrvitasGlobal",
    title: "OrvitasGlobal | Premier Student Consultancy",
    description: "Expert guidance for students aspiring to study in the UK, Europe, Canada, and Australia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OrvitasGlobal - Gateway to Global Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrvitasGlobal | Premier Student Consultancy",
    description: "Expert guidance for students aspiring to study in the UK, Europe, Canada, and Australia.",
    images: ["/og-image.jpg"],
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
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
