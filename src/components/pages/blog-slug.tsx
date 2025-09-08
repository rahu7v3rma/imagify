'use client';

import { Button } from '@/components/shared/buttons';
import { Spinner } from '@/components/shared/loaders';
import PageTransition from '@/components/shared/transitions';
import { H1, P } from '@/components/ui/typography';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

interface BlogSlugProps {
  slug: string;
}

export function BlogSlug({ slug }: BlogSlugProps) {
  const router = useRouter();
  const { data: blog, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container py-8 mt-10 text-center mx-auto">
          <div className="flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <PageTransition>
      <div className="container py-8 mt-10 text-center mx-auto">
        <H1 className="mb-6 max-w-4xl mx-auto">{blog.title}</H1>
        <P className="mb-8 w-1/2 mx-auto">{blog.content}</P>
        {blog.ctaLink && (
          <div className="w-max mx-auto">
            <Button
              onClick={() => router.push(blog.ctaLink!)}
              variant="default"
              className="w-max"
            >
              Learn More
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
