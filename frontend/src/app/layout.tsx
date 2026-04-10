import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisaOS — The Immigration Operating System",
  description:
    "AI-powered U.S. visa eligibility platform. Evaluate your O-1A and E-2 visa cases with intelligence built on 2026 USCIS standards. Speed. Excellence. Care.",
  keywords: ["VisaOS", "visa", "O-1A", "E-2", "immigration", "USCIS", "eligibility", "legal tech"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
