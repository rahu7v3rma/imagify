import { Card, CardContent } from "@/components/ui/card";
import { TOOLS } from "@/constants/public/home";
import { H1, Muted, P } from "@/components/ui/typography";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <H1>Image Processing Tools</H1>
        <P>Powerful AI-driven tools for all your image processing needs</P>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOOLS.map(({ icon: Icon, href, title, description }) => (
          <Card key={href} className="h-full">
            <CardContent className="p-6 h-full">
              <div className="h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  <Icon />
                </div>
                <div className="text-center mt-4">
                  <P>{title}</P>
                  <Muted>{description}</Muted>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
