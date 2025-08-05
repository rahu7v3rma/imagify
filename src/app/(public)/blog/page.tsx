import { H1, P } from "@/components/ui/typography";
import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/blog";
import PageTransition from "@/components/page-transition";

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <Breadcrumbs className="mb-8" items={BREADCRUMB_ITEMS} />
        <div className="text-center mb-12">
          <H1>Blog</H1>
          <P>Insights, tips, and updates on image processing.</P>
        </div>
      </div>
    </PageTransition>
  );
}
