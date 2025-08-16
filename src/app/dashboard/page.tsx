import PageTransition from "@/components/transitions";
import { H1, Muted } from "@/components/ui/typography";

export const metadata = {
  title: "Dashboard - Imagify",
  description: "Access all your image processing tools in one place.",
};

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <div className="mb-8 flex flex-col items-start">
          <H1>Dashboard</H1>
          <Muted>
            Welcome back! Choose a tool to get started with your image
            processing needs.
          </Muted>
        </div>
      </div>
    </PageTransition>
  );
}
