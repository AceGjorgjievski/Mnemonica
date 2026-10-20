import type { Metadata, Viewport } from "next";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Mnemonica Trainer",
  description: "Practice the Mnemonica stack: number ↔ card, both ways.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f1115",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
