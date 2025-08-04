"use client";

import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { EmailInput, Textarea } from "@/components/inputs";
import { useContactForm } from "@/hooks/public/contact";
import { withLoader } from "@/utils/ui";

export default function ContactForm() {
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
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
        {successMessage && <SuccessAlert message={successMessage} />}
        {errorMessage && <ErrorAlert message={errorMessage} />}
      </form>
    </>
  );
}
