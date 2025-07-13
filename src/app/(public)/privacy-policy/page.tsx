"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-zinc-200">
      <h1 className="text-3xl font-bold dark:text-white">Privacy Policy</h1>
      <p>
        This Privacy Policy explains how imagify.pro (&quot;we&quot;,
        &quot;our&quot;, or &quot;us&quot;) collects, uses, and safeguards your
        information when you use our application.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">
        1. Services We Use
      </h2>
      <p>
        imagify.pro relies on the following third-party service providers to
        operate the platform:
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>
            <a
              href="https://firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              Firebase
            </a>
          </strong>{" "}
          &mdash; authentication, database, file storage, and hosting.
        </li>
        <li>
          <strong>
            <a
              href="https://razorpay.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              Razorpay
            </a>
          </strong>{" "}
          &mdash; secure payment collection and subscription management.
        </li>
        <li>
          <strong>
            <a
              href="https://replicate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              Replicate
            </a>
          </strong>{" "}
          &mdash; machine-learning infrastructure used to process images. Images
          you submit for processing are transmitted to Replicate's API solely
          for the purpose of generating the requested output.
        </li>
        <li>
          <strong>
            <a
              href="https://tinify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              Tinify
            </a>
          </strong>{" "}
          &mdash; image compression services used to optimize and compress
          images efficiently.
        </li>
        <li>
          <strong>
            <a
              href="https://openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline"
            >
              OpenAI
            </a>
          </strong>{" "}
          &mdash; AI processing services used for advanced image analysis and
          generation capabilities.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold dark:text-white">
        2. Data We Collect
      </h2>
      <p className="mb-2">We collect and process the following data:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Email address</strong> &mdash; collected during sign-up and
          login for authentication and service-related communications.
        </li>
        <li>
          <strong>User-generated content</strong> (images you upload or link,
          prompts you provide, extracted text, and any output images produced)
          &mdash; stored in Firebase Storage so you can download and manage your
          results.
        </li>
        <li>
          <strong>Usage information</strong> such as remaining processing&nbsp;
          <em>credits</em> &mdash; stored in database to enable billing logic.
        </li>
        <li>
          <strong>Payment information</strong> &mdash; handled directly by
          Razorpay. We do not store your full card details on our servers.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold dark:text-white">
        3. How We Use Your Data
      </h2>
      <ul className="list-disc list-inside space-y-1">
        <li>To authenticate and secure your account.</li>
        <li>To process images and return the requested output.</li>
        <li>To manage usage credits.</li>
        <li>To process payments and send transactional emails.</li>
        <li>To respond to inquiries and provide customer support.</li>
      </ul>

      <h2 className="text-2xl font-semibold dark:text-white">
        4. We Do Not Sell Your Data
      </h2>
      <p>
        imagify.pro does not sell, rent, lease, or otherwise monetize any of
        your uploaded images, generated images, or personal data to third
        parties. Your content and data remain yours, and we only use them to
        provide the services you have requested. We do not share your images or
        data with advertisers, data brokers, or any other parties for commercial
        purposes.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">
        5. Cookie Policy
      </h2>
      <p>
        Firebase sets cookies that are strictly necessary for authentication and
        session persistence (e.g.&nbsp;to keep you signed in as you navigate the
        dashboard). imagify.pro does not set additional advertising or analytics
        cookies.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">
        6. Data Retention
      </h2>
      <p>
        Email addresses and usage credits are retained for as long as your
        account remains active. You may delete your account at any time from the{" "}
        <em>Settings</em> page, which will permanently remove your personal data
        and stored files.
      </p>
      <p>
        <strong>Image Storage Policy:</strong> Both uploaded images and
        generated images are automatically deleted from our servers after 24
        hours. This ensures your privacy and minimizes data storage. We
        recommend downloading any images you wish to keep before this time
        period expires.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">7. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the right to access,
        correct, download, or delete the personal data we hold about you. To
        exercise these rights, please contact us using the details below.
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">8. Contact</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, email
        us at{" "}
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
