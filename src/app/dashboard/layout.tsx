import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
