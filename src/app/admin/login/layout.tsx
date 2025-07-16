import NavbarComponent from "./_components/navbar";
import FooterComponent from "./_components/footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-2">
        <NavbarComponent />
      </div>
      <div className="flex-1 p-2 flex flex-col items-center justify-center">
        {children}
      </div>
      <FooterComponent />
    </div>
  );
} 