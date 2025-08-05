import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-[8%]">
        <Header />
      </div>
      <div className="flex h-[92%] w-full">
        <Sidebar />
        <main className="p-4 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
