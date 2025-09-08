'use client';

import PageTransition from '@/components/shared/transitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { H1, P } from '@/components/ui/typography';
import NextLink from 'next/link';
import { MotionCardWrapper } from '@/components/shared/cards';
import { trpc } from '@/lib/trpc/client';
import { Spinner } from '@/components/shared/loaders';

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

export default function BlogPage() {
  const { data: blogs, isLoading } = trpc.blog.getAll.useQuery();

  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mb-8" />
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3">
            <H1>Blog</H1>
            {isLoading && <Spinner size="sm" />}
          </div>
          <P>Insights, tips, and updates on image processing.</P>
        </div>

        <div className="container mx-auto">
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs
                ?.filter((blog: any) => blog.slug)
                .map((blog: any) => (
                  <BlogCard
                    key={blog.id}
                    title={blog.title}
                    description={blog.content.substring(0, 150) + '...'}
                    slug={blog.slug!}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
