"use client";

import PageTransition from "@/components/shared/transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1, P } from "@/components/ui/typography";
import NextLink from "next/link";
import { MotionCardWrapper } from "../shared/cards";

interface Blog {
  id: number;
  title: string;
  content: string;
  ctaLink: string | null;
  slug: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPageProps {
  blogs: Blog[];
}

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
}

function BlogCard({ title, description, slug }: BlogCardProps) {
  return (
    <MotionCardWrapper>
      <NextLink href={`/blog/${slug}`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="line-clamp-2">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </CardContent>
        </Card>
      </NextLink>
    </MotionCardWrapper>
  );
}

export default function BlogPage({ blogs }: BlogPageProps) {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mb-8" />
        <div className="text-center mb-12">
          <H1>Blog</H1>
          <P>Insights, tips, and updates on image processing.</P>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs
              .filter((blog) => blog.slug)
              .map((blog) => (
                <BlogCard
                  key={blog.id}
                  title={blog.title}
                  description={blog.content.substring(0, 150) + "..."}
                  slug={blog.slug!}
                />
              ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
