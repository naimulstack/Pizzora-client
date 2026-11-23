
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorNotificationsMenu from "@/components/vendor/VendorNotificationsMenu";

export default async function VendorLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "vendor") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-surface text-content">
      <VendorSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-surface bg-surface/90 px-5 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-end">
            <VendorNotificationsMenu />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
