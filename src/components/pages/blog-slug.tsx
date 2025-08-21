"use client";

import { H1, P } from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/buttons";

interface BlogSlugProps {
  title: string;
  content: string;
  ctaLink?: string;
}

export function BlogSlug({ title, content, ctaLink }: BlogSlugProps) {
  const router = useRouter();
  return (
    <div className="container py-8 mt-10 text-center mx-auto">
      <H1 className="mb-6 max-w-4xl mx-auto">{title}</H1>
      <P className="mb-8 w-1/2 mx-auto">{content}</P>
      {ctaLink && (
        <div className="w-max mx-auto">
          <Button
            onClick={() => router.push(ctaLink)}
            variant="default"
            className="w-max"
          >
            Learn More
          </Button>
        </div>
      )}
    </div>
  );
}
