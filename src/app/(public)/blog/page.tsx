import BlogComponent from "@/components/pages/blog";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Blog - Imagify",
  description:
    "Read the latest insights, tips, and updates on AI image processing and our tools.",
};

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <BlogComponent blogs={blogs} />;
}
