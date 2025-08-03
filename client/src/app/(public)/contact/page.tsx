"use client";

import { EmailInput, Textarea } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Have a question or need help? Send us a message and we&apos;ll get back
        to you as soon as possible.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <Textarea
          label="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="default">Send Message</Button>
      </form>

      <div className="mt-4 p-3 bg-default-50 border border-default-200 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> If you&apos;re having trouble with the form,
          you can also reach us directly at{" "}
          <a
            href="mailto:support@imagify.pro"
            className="text-primary hover:text-primary-600 transition-colors underline"
          >
            support@imagify.pro
          </a>
        </p>
      </div>
    </div>
  );
}
