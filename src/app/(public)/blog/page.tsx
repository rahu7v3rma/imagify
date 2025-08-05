import Link from "next/link";
import { H1, P } from "@/components/ui/typography";
import PageTransition from "@/components/page-transition";
import { ROUTES } from "@/configs/app";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BlogPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <div className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={ROUTES.HOME}>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </div>
            <div className="flex items-center">
              <BreadcrumbItem>
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="text-center mb-12">
          <H1>Blog</H1>
          <P>Insights, tips, and updates on image processing.</P>
        </div>
      </div>
    </PageTransition>
  );
}
