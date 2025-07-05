import NavbarComponent from "./_components/navbar";
import FooterComponent from "./_components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="p-2">
        <NavbarComponent />
      </div>
      <div className="p-2 flex flex-col items-center justify-center pb-20">
        {children}
        <FooterComponent />
      </div>
    </div>
  );
}
