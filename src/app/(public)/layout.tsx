import NavbarComponent from "@/components/public/navbar";
import FooterComponent from "@/components/public/footer";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
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
