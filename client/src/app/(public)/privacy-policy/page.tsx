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
        2. Data We Collect
      </h2>
      <p className="mb-2">We collect and process the following data:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          <strong>Email address</strong> &mdash; collected during sign-up and
          login for authentication and service-related communications.
        </li>
        <li>
          <strong>User-generated content</strong> &mdash; Only images (uploaded 
          or generated) are temporarily stored so you can download your results.
          Links, prompts, and text are never stored on our servers. All images 
          are automatically deleted daily at midnight UTC.
        </li>
        <li>
          <strong>Usage information</strong> such as remaining processing&nbsp;
          <em>credits</em> &mdash; stored in database to enable billing logic.
        </li>
        <li>
          <strong>Payment information</strong> &mdash; handled directly by our
          secure payment processors. We do not store your payment details on
          our servers.
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
        We use cookies that are strictly necessary for authentication and
        session persistence (e.g.&nbsp;to keep you signed in as you navigate the
        dashboard).
      </p>

      <h2 className="text-2xl font-semibold dark:text-white">
        6. Data Retention
      </h2>
      <p>
        Email addresses and usage credits are retained for as long as your
        account remains active. You may delete your account at any time from the{" "}
        <em>Dashboard {'>'} Settings</em> page, which will permanently remove your personal data.
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
