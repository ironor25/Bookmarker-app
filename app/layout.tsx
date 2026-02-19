import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <div className="relative min-h-screen">
          <div className="fixed inset-0 pointer-events-none bg-orange-radial" />
          {children}
        </div>
      </body>
    </html>
  );
}

