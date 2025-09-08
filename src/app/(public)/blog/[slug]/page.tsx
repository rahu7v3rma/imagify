import { BlogSlug } from '@/components/pages/blog-slug';
import { prisma } from '@/lib/prisma';

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const blog = await prisma.blog.findFirst({
    where: {
      slug: resolvedParams.slug,
    },
  });

  if (!blog) {
    return {
      title: 'Blog Post - Imagify',
      description: 'Blog post not found.',
    };
  }

  return {
    title: `${blog.title} - Imagify`,
    description: blog.content.substring(0, 150) + '...',
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const resolvedParams = await params;

  return <BlogSlug slug={resolvedParams.slug} />;
}
