"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TermsOfServicePage() {
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
              <BreadcrumbPage>Terms of Service</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-zinc-200 text-[15px] py-10">
        <h1 className="text-[29px] font-bold dark:text-white">
          Terms of Service
        </h1>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of imagify.pro (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
          &ldquo;us&rdquo;). By creating an account or using the platform in any
          way, you agree to be bound by these Terms. If you do not agree with
          any part of the Terms, you may not use imagify.pro.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          1. Services Provided
        </h2>
        <p>
          imagify.pro offers cloud-based tools to manipulate images, including
          but not limited to:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Generate Image – Create stunning images from text using AI</li>
          <li>Remove Background – Remove backgrounds from images instantly</li>
          <li>
            Extract Text (OCR) – Extract text from screenshots or scanned
            documents
          </li>
          <li>
            Upscale Image – Enlarge images up to 4× while preserving detail
          </li>
          <li>
            Compress Image – Reduce image file size without losing quality
          </li>
          <li>Convert Format – Convert images between different formats</li>
          <li>Edit Image – Smart adjustments and transformations</li>
        </ul>
        <p>
          The exact feature set may evolve over time as we continue to enhance
          our AI-assisted transformations.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          2. User Accounts
        </h2>
        <p>
          You must create an account to access most features. You are
          responsible for maintaining the confidentiality of your login
          credentials and for all activities that occur under your account. You
          must promptly notify us of any unauthorised use or security breach.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          3. Credits & Payments
        </h2>
        <p>
          Certain features require prepaid processing credits. Credits are
          non-transferable and non-refundable except where required by law.
          Payments are processed securely by us through trusted payment
          providers.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          4. Acceptable Use
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Do not upload any content that you do not have the right to use.
          </li>
          <li>
            Do not use imagify.pro for unlawful, harmful, or hateful purposes.
          </li>
          <li>
            Do not attempt to reverse-engineer, interfere with, or disrupt the
            platform or its infrastructure.
          </li>
        </ul>

        <h2 className="text-[23px] font-semibold dark:text-white">
          5. Intellectual Property
        </h2>
        <p>
          imagify.pro retains all rights, title, and interest in the platform.
          You retain ownership of images and content you upload. By uploading
          content you grant us a limited licence to process and store that
          content solely for the purpose of providing the requested services.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          6. Content Usage and Data Storage Policy
        </h2>
        <p>
          We do not use, analyze, or derive any commercial value from your
          uploaded content beyond providing the specific image processing
          services you request. All images you upload are stored temporarily on
          our servers solely for the purpose of processing and delivering the
          requested transformations.
        </p>
        <p>
          For security and privacy protection, all stored images and associated
          data are automatically deleted from our servers daily at midnight UTC.
          We do not retain copies of your images beyond this processing period,
          and we do not use your content to train our AI models or for any other
          purposes.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          7. Rights to Generated Images
        </h2>
        <p>
          You retain full rights to use, modify, distribute, and commercialize
          any images generated, processed, or modified through our services.
          This includes but is not limited to images with backgrounds removed,
          upscaled images, and any other outputs produced by our AI-powered
          tools. You may use these generated images for any lawful purpose,
          including commercial use, without any additional licensing fees or
          royalties to imagify.pro.
        </p>
        <p>
          However, you acknowledge that similar or identical outputs may be
          generated for other users processing similar input images. We do not
          guarantee exclusivity of any particular generated image or output.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          8. Disclaimer of Warranties
        </h2>
        <p>
          imagify.pro is provided on an &ldquo;as-is&rdquo; basis without
          warranties of any kind. We do not guarantee that the platform will be
          uninterrupted, secure, or error-free, or that the outputs will meet
          your expectations.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          9. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, in no event shall imagify.pro
          be liable for any indirect, incidental, special, consequential or
          punitive damages, or any loss of profits or revenues, arising from
          your use of the platform.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          10. Termination
        </h2>
        <p>
          We may suspend or terminate your access at any time if we reasonably
          believe you have violated these Terms. You may delete your account at
          any time via the Settings page.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          11. Changes to Terms
        </h2>
        <p>
          We may update these Terms from time to time. Significant changes will
          be notified through the platform or by email. Continued use after the
          effective date constitutes acceptance of the revised Terms.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          12. Governing Law
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which imagify.pro is operated, without
          regard to conflict of law principles.
        </p>

        <h2 className="text-[23px] font-semibold dark:text-white">
          13. Contact
        </h2>
        <p>
          For questions regarding these Terms, please contact us at{" "}
          <a
            href="mailto:support@imagify.pro"
            className="text-primary-600 underline"
          >
            support@imagify.pro
          </a>
          .
        </p>
      </div>
    </div>
  );
}
