
import VendorSidebar from "@/components/vendor/VendorSidebar";

export default function VendorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface text-content">
      <VendorSidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
