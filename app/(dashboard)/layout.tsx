import { checkAuthSync } from "@/lib/auth-sync";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { LayoutRenderer } from "../components/layout/layout-renderer";

const inter = Inter({ subsets: ["latin"] });

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminUser = null;
  try {
    adminUser = await checkAuthSync();
  } catch (error) {
    console.error("Authorization check failed:", error);
    return (
      <ClerkProvider>
        <html lang="en" className="dark">
          <body
            className={`${inter.className} bg-slate-950 text-white flex items-center justify-center h-screen`}
          >
            <div className="max-w-md text-center p-8 rounded-xl border border-red-900/50 bg-red-900/10">
              <div className="h-12 w-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                !
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Access Denied
              </h1>
              <p className="text-slate-400 mb-6">
                Your account is not authorized to access Vault. Please contact a
                Super Admin to request an invite.
              </p>
            </div>
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return <LayoutRenderer adminUser={adminUser}>{children}</LayoutRenderer>;
}
