import NavbarComponent from "./_components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-2">
        <NavbarComponent />
      </div>
      <div className="p-2 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
