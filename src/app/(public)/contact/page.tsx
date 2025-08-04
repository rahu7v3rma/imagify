"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/contact";
import ContactForm from "@/components/public/contact";
import { CONTACT_EMAIL } from "@/constants/app";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Muted } from "@/components/ui/typography";

export default function ContactPage() {
  return (
    <div className="h-full w-full">
      <div className="w-full">
        <Breadcrumbs className="mb-8" items={BREADCRUMB_ITEMS} />
      </div>
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center w-1/4">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Have a question or need help? Send us a message and we&apos;ll get
              back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <ContactForm />
            <div className="mt-4 flex justify-center w-full">
              <Badge variant="outline" className="text-center w-full text-xs">
                <Link href={`mailto:${CONTACT_EMAIL}`}>
                  <Muted className="text-xs">
                    If you&apos;re having trouble with the form, you can also
                    reach us directly at {CONTACT_EMAIL}
                  </Muted>
                </Link>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
