"use client";

import { EmailInput, Textarea } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { FormEvent, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { H1, Muted, P } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full w-full">
      <div className="w-full">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Textarea
                label="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="default" className="mt-2">Send Message</Button>
            </form>

            <div className="mt-4 p-3 bg-default-50 border border-default-200 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> If you&apos;re having trouble with the
                form, you can also reach us directly at{" "}
                <a
                  href="mailto:support@imagify.pro"
                  className="text-primary hover:text-primary-600 transition-colors underline"
                >
                  support@imagify.pro
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
