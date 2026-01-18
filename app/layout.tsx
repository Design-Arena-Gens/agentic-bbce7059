import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gold Pulse | Intelligent XAU/USD Analyst",
  description:
    "Autonomous gold market researcher delivering technical analysis, macro insights, and actionable trading guidance."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
