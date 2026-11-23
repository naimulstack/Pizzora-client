"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const route = async () => {
      try {
        const { data: session } = await authClient.getSession();
        const role = String(session?.user?.role || "customer").toLowerCase();

        if (!active) return;

        if (role === "admin") {
          router.replace("/dashboard/admin");
        } else if (role === "vendor") {
          router.replace("/dashboard/vendor");
        } else {
          router.replace("/dashboard/customer");
        }
      } catch {
        if (active) router.replace("/sign-in");
      }
    };

    route();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <p className="text-muted-content">Redirecting to your dashboard...</p>
    </div>
  );
}
