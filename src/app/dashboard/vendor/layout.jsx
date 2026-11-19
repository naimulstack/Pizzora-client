
import VendorSidebar from "@/components/vendor/VendorSidebar";

export default function VendorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <VendorSidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
