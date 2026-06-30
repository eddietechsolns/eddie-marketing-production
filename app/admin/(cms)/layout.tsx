import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
