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
import { EmailInput, Textarea } from "@/components/inputs";
import { Muted } from "@/components/ui/typography";
import { SuccessAlert, ErrorAlert } from "@/components/alerts";
import { withLoader } from "@/utils/ui";
import { CONTACT_EMAIL } from "@/constants/app";
import Link from "next/link";
import { useContactForm } from "@/hooks/public/contact";
import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/contact";

export default function ContactPage() {
  const {
    successMessage,
    errorMessage,
    isPending,
    setEmail,
    setMessage,
    emailError,
    messageError,
    email,
    message,
    isFormValid,
    handleSubmit,
  } = useContactForm();

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
            {successMessage && <SuccessAlert message={successMessage} />}

            {errorMessage && <ErrorAlert message={errorMessage} />}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <EmailInput
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              <Textarea
                label="Your message"
                value={message || ""}
                onChange={(e) => setMessage(e.target.value)}
                error={messageError}
              />
              <Button
                variant="default"
                className="mt-2"
                disabled={!isFormValid || isPending}
                type="submit"
              >
                {withLoader({ text: "Send Message", isLoading: isPending })}
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
