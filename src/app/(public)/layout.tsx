import PublicLayoutComponent from "@/components/layouts/public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutComponent>{children}</PublicLayoutComponent>;
}
