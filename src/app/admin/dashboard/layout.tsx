import AdminHeader from "./_components/header";
import AdminSidebar from "./_components/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-[8%]">
        <AdminHeader />
      </div>
      <div className="flex h-[92%] w-full">
        <AdminSidebar />
        <main className="p-4 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
} 