import NavbarComponent from "@/components/public/navbar";
import FooterComponent from "@/components/public/footer";
import { PublicLayoutProps } from "@/types/app/public/layout";

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="">
        <NavbarComponent />
      </div>
      <div className="flex-1 flex flex-col w-full h-full px-10 py-4">
        {children}
      </div>
      <FooterComponent />
    </div>
  );
}
