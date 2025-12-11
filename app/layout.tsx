import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/layout/sidebar";
import { MobileNav } from "./components/layout/mobile-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vault | Enterprise Banking",
  description: "Internal banking administration dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}
      >
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />

          <MobileNav />

          <main className="flex-1 p-4 lg:p-8 lg:ml-64 w-full max-w-[100vw] overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
