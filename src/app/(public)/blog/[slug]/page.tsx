import { BlogSlug } from "@/components/pages/blog-slug";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPageProps) {
  const blog = await prisma.blog.findFirst({
    where: {
      slug: params.slug,
    },
  });

  if (!blog) {
    return {
      title: "Blog Post - Imagify",
      description: "Blog post not found.",
    };
  }

  return {
    title: `${blog.title} - Imagify`,
    description: blog.content.substring(0, 150) + "...",
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await prisma.blog.findFirst({
    where: {
      slug: params.slug,
    },
  });

  if (!blog) {
    notFound();
  }

  return (
    <BlogSlug
      title={blog.title}
      content={blog.content}
      ctaLink={blog.ctaLink || undefined}
    />
  );
}