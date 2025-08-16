import { H1, P } from "@/components/ui/typography";
import PageTransition from "@/components/shared/transitions";

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mb-8" />
        <div className="text-center mb-12">
          <H1>Blog</H1>
          <P>Insights, tips, and updates on image processing.</P>
        </div>
      </div>
    </PageTransition>
  );
}
