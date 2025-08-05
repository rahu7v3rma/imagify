"use client";

import { H1, H2, P, List, Link } from "@/components/ui/typography";
import { CONTACT_EMAIL } from "@/configs/app";
import PageTransition from "@/components/page-transition";
import NextLink from "next/link";
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
    <PageTransition>
      <div className="h-full w-full">
        <div className="w-full">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NextLink href="/">Home</NextLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbPage>Terms of Service</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-zinc-200 text-[15px] py-10">
          <H1>Terms of Service</H1>
          <P>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
            and use of imagify.pro (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
            &ldquo;us&rdquo;). By creating an account or using the platform in
            any way, you agree to be bound by these Terms. If you do not agree
            with any part of the Terms, you may not use imagify.pro.
          </P>

          <H2>1. Services Provided</H2>
          <P>
            imagify.pro offers cloud-based tools to manipulate images, including
            but not limited to:
          </P>
          <List
            className="space-y-1 ml-4"
            options={[
              "Generate Image – Create stunning images from text using AI",
              "Remove Background – Remove backgrounds from images instantly",
              "Extract Text (OCR) – Extract text from screenshots or scanned documents",
              "Upscale Image – Enlarge images up to 4× while preserving detail",
              "Compress Image – Reduce image file size without losing quality",
              "Convert Format – Convert images between different formats",
              "Edit Image – Smart adjustments and transformations",
            ]}
          />
          <P>
            The exact feature set may evolve over time as we continue to enhance
            our AI-assisted transformations.
          </P>

          <H2>2. User Accounts</H2>
          <P>
            You must create an account to access most features. You are
            responsible for maintaining the confidentiality of your login
            credentials and for all activities that occur under your account.
            You must promptly notify us of any unauthorised use or security
            breach.
          </P>

          <H2>3. Credits & Payments</H2>
          <P>
            Certain features require prepaid processing credits. Credits are
            non-transferable and non-refundable except where required by law.
            Payments are processed securely by us through trusted payment
            providers.
          </P>

          <H2>4. Acceptable Use</H2>
          <List
            className="space-y-1"
            options={[
              "Do not upload any content that you do not have the right to use.",
              "Do not use imagify.pro for unlawful, harmful, or hateful purposes.",
              "Do not attempt to reverse-engineer, interfere with, or disrupt the platform or its infrastructure.",
            ]}
          />

          <H2>5. Intellectual Property</H2>
          <P>
            imagify.pro retains all rights, title, and interest in the platform.
            You retain ownership of images and content you upload. By uploading
            content you grant us a limited licence to process and store that
            content solely for the purpose of providing the requested services.
          </P>

          <H2>6. Content Usage and Data Storage Policy</H2>
          <P>
            We do not use, analyze, or derive any commercial value from your
            uploaded content beyond providing the specific image processing
            services you request. All images you upload are stored temporarily
            on our servers solely for the purpose of processing and delivering
            the requested transformations.
          </P>
          <P>
            For security and privacy protection, all stored images and
            associated data are automatically deleted from our servers daily at
            midnight UTC. We do not retain copies of your images beyond this
            processing period, and we do not use your content to train our AI
            models or for any other purposes.
          </P>

          <H2>7. Rights to Generated Images</H2>
          <P>
            You retain full rights to use, modify, distribute, and commercialize
            any images generated, processed, or modified through our services.
            This includes but is not limited to images with backgrounds removed,
            upscaled images, and any other outputs produced by our AI-powered
            tools. You may use these generated images for any lawful purpose,
            including commercial use, without any additional licensing fees or
            royalties to imagify.pro.
          </P>
          <P>
            However, you acknowledge that similar or identical outputs may be
            generated for other users processing similar input images. We do not
            guarantee exclusivity of any particular generated image or output.
          </P>

          <H2>8. Disclaimer of Warranties</H2>
          <P>
            imagify.pro is provided on an &ldquo;as-is&rdquo; basis without
            warranties of any kind. We do not guarantee that the platform will
            be uninterrupted, secure, or error-free, or that the outputs will
            meet your expectations.
          </P>

          <H2>9. Limitation of Liability</H2>
          <P>
            To the fullest extent permitted by law, in no event shall
            imagify.pro be liable for any indirect, incidental, special,
            consequential or punitive damages, or any loss of profits or
            revenues, arising from your use of the platform.
          </P>

          <H2>10. Termination</H2>
          <P>
            We may suspend or terminate your access at any time if we reasonably
            believe you have violated these Terms. You may delete your account
            at any time via the Settings page.
          </P>

          <H2>11. Changes to Terms</H2>
          <P>
            We may update these Terms from time to time. Significant changes
            will be notified through the platform or by email. Continued use
            after the effective date constitutes acceptance of the revised
            Terms.
          </P>

          <H2>12. Governing Law</H2>
          <P>
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which imagify.pro is operated,
            without regard to conflict of law principles.
          </P>

          <H2>13. Contact</H2>
          <P>
            For questions regarding these Terms, please contact us at{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>.
          </P>
        </div>
      </div>
    </PageTransition>
  );
}
