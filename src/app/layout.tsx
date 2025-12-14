import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Dessy69 Cafe - Fruit Fuelled Ice Creams & Desserts",
    template: "%s | Dessy69 Cafe",
  },
  description:
    "Experience nature's sweetness with our artisanal fruit-based ice creams and desserts. Handcrafted with love, delivered fresh. #dessy69 🍨",
  keywords: [
    "ice cream",
    "fruit desserts",
    "healthy desserts",
    "natural ice cream",
    "dessy69",
  ],
  authors: [{ name: "Dessy69 Cafe" }],
  creator: "Dessy69 Cafe",
  publisher: "Dessy69 Cafe",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dessy69 Cafe",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dessy69.com",
    siteName: "Dessy69 Cafe",
    title: "Dessy69 Cafe - Fruit Fuelled Ice Creams",
    description: "Artisanal fruit-based ice creams and desserts",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dessy69 Cafe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dessy69 Cafe - Fruit Fuelled Ice Creams",
    description: "Artisanal fruit-based ice creams and desserts",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
