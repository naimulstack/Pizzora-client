
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import VendorSidebar from "@/components/vendor/VendorSidebar";

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

      <main className="min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
