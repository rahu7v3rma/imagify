import NavbarComponent from "@/components/public/navbar";
import FooterComponent from "@/components/public/footer";
import { PublicLayoutProps } from "@/types/app/public/layout";

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="">
        <NavbarComponent />
      </div>
      <div className="flex-1 p-2 flex flex-col items-center justify-center">
        {children}
      </div>
      <FooterComponent />
    </div>
  );
}
