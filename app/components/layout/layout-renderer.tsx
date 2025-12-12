// components/layout/layout-renderer.tsx
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { AdminUserPayload } from "@/types/admin";

type LayoutRendererProps = {
  children: React.ReactNode;
  adminUser: AdminUserPayload | null;
};

export function LayoutRenderer({ children, adminUser }: LayoutRendererProps) {
  const pathname = usePathname();

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar user={adminUser} />
      <MobileNav user={adminUser} />

      <main className="flex-1 lg:ml-64 w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
