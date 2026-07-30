import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Yahoo Partner Portal prototype",
  description:
    "Partner-facing analytics and feed health dashboard prototype for portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-yahoo-product-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

