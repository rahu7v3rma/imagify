import NavbarComponent from "@/components/public/navbar";
import FooterComponent from "@/components/public/footer";
export interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavbarComponent />
      </div>
      <div className="pt-16 pb-20 px-10 py-4 min-h-screen overflow-y-auto">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <FooterComponent />
      </div>
    </div>
  );
}
