import { H1, P } from "@/components/ui/typography";
import { HomeToolsGrid } from "@/components/public/home";
import PageTransition from "@/components/page-transition";

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12 mt-12">
          <H1>Image Processing Tools</H1>
          <P>Powerful AI-driven tools for all your image processing needs</P>
        </div>

        <HomeToolsGrid />
      </div>
    </PageTransition>
  );
}
