import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex h-full w-full">
        <Sidebar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
