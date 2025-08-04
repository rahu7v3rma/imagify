"use client";

import { Button } from "@/components/buttons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Muted } from "@/components/ui/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { CONTACT_EMAIL } from "@/constants/app";
import Link from "next/link";
import { useContact } from "@/hooks/public/contact";
import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/contact";

export default function ContactPage() {
  const { form, successMessage, errorMessage, isPending, onSubmit } =
    useContact();

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
            {successMessage && (
              <Alert className="mb-4">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your message</Label>
                <Textarea id="message" {...form.register("message")} />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
              <Button
                variant="default"
                className="mt-2"
                disabled={!form.formState.isValid || isPending}
                type="submit"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

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
