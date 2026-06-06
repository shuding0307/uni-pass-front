import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uni Pass",
  description: "Uni Pass frontend application"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
