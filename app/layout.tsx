import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTakTuk | FariSQL",
  description:
    "Platform manajemen basis data kolaboratif oleh Tim FariSQL. Studi Kasus Basis Data B Genap 2025/2026.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground flex flex-col selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
