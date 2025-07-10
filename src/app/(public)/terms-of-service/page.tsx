"use client";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-zinc-200">
      <h1 className="text-3xl font-bold dark:text-white">Terms of Service</h1>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
        Imagify (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By creating an account or using the
        platform in any way, you agree to be bound by these Terms. If you do
        not agree with any part of the Terms, you may not use Imagify.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">1. Services Provided</h2>
      <p>
        Imagify offers cloud-based tools to manipulate images, including but not
        limited to background removal, upscaling, text extraction, and other
        AI-assisted transformations. The exact feature set may evolve over time.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">2. User Accounts</h2>
      <p>
        You must create an account to access most features. You are responsible
        for maintaining the confidentiality of your login credentials and for
        all activities that occur under your account. You must promptly notify
        us of any unauthorised use or security breach.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">3. Credits & Payments</h2>
      <p>
        Certain features require prepaid processing credits (&ldquo;cents&rdquo;). Credits
        are non-transferable and non-refundable except where required by law.
        Payments are processed securely by our third-party provider, Stripe.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">4. Acceptable Use</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Do not upload any content that you do not have the right to use.</li>
        <li>Do not use Imagify for unlawful, harmful, or hateful purposes.</li>
        <li>
          Do not attempt to reverse-engineer, interfere with, or disrupt the
          platform or its infrastructure.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold dark:text-white">5. Intellectual Property</h2>
      <p>
        Imagify retains all rights, title, and interest in the platform. You
        retain ownership of images and content you upload. By uploading content
        you grant us a limited licence to process and store that content solely
        for the purpose of providing the requested services.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">6. Rights to Generated Images</h2>
      <p>
        You retain full rights to use, modify, distribute, and commercialize any images
        generated, processed, or modified through our services. This includes but is not
        limited to images with backgrounds removed, upscaled images, and any other outputs
        produced by our AI-powered tools. You may use these generated images for any lawful
        purpose, including commercial use, without any additional licensing fees or royalties
        to Imagify.
      </p>
      <p>
        However, you acknowledge that similar or identical outputs may be generated for other
        users processing similar input images. We do not guarantee exclusivity of any
        particular generated image or output.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">7. Disclaimer of Warranties</h2>
      <p>
        Imagify is provided on an &ldquo;as-is&rdquo; basis without warranties of any kind.
        We do not guarantee that the platform will be uninterrupted, secure, or
        error-free, or that the outputs will meet your expectations.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">8. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, in no event shall Imagify be
        liable for any indirect, incidental, special, consequential or punitive
        damages, or any loss of profits or revenues, arising from your use of
        the platform.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">9. Termination</h2>
      <p>
        We may suspend or terminate your access at any time if we reasonably
        believe you have violated these Terms. You may delete your account at
        any time via the Settings page.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">10. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Significant changes will
        be notified through the platform or by email. Continued use after the
        effective date constitutes acceptance of the revised Terms.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">11. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the jurisdiction in which Imagify is operated, without regard
        to conflict of law principles.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">12. Contact</h2>
      <p>
        For questions regarding these Terms, please contact us at{' '}
        <a
          href="mailto:support@imagify.pro"
          className="text-primary-600 underline"
        >
          support@imagify.pro
        </a>
        .
      </p>
    </div>
  );
}
