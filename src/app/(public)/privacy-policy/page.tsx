import Breadcrumbs from "@/components/breadcrumbs";
import { BREADCRUMB_ITEMS } from "@/constants/public/privacy-policy";
import { H1, H2, P, List, Link } from "@/components/ui/typography";
import { CONTACT_EMAIL } from "@/constants/app";
import PageTransition from "@/components/page-transition";

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="w-full">
          <Breadcrumbs className="mb-8" items={BREADCRUMB_ITEMS} />
        </div>
        <div className="max-w-3xl mx-auto space-y-6 text-[15px] py-10">
          <H1>Privacy Policy</H1>
          <P>
            This Privacy Policy explains how imagify.pro (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;) collects, uses, and safeguards
            your information when you use our application.
          </P>

          <H2>2. Data We Collect</H2>
          <P className="mb-2">We collect and process the following data:</P>
          <List
            className="space-y-1"
            options={[
              <>
                Email address &mdash; collected during sign-up and login for
                authentication and service-related communications.
              </>,
              <>
                User-generated content &mdash; Only images (uploaded or
                generated) are temporarily stored so you can download your
                results. Links, prompts, and text are never stored on our
                servers. All images are automatically deleted daily at midnight
                UTC.
              </>,
              <>
                Usage information such as remaining processing <em>credits</em>{" "}
                &mdash; stored in database to enable billing logic.
              </>,
              <>
                Payment information &mdash; handled directly by our secure
                payment processors. We do not store your payment details on our
                servers.
              </>,
            ]}
          />

          <H2>3. How We Use Your Data</H2>
          <List
            className="space-y-1"
            options={[
              "To authenticate and secure your account.",
              "To process images and return the requested output.",
              "To manage usage credits.",
              "To process payments and send transactional emails.",
              "To respond to inquiries and provide customer support.",
            ]}
          />

          <H2>4. We Do Not Sell Your Data</H2>
          <P>
            imagify.pro does not sell, rent, lease, or otherwise monetize any of
            your uploaded images, generated images, or personal data to third
            parties. Your content and data remain yours, and we only use them to
            provide the services you have requested. We do not share your images
            or data with advertisers, data brokers, or any other parties for
            commercial purposes.
          </P>

          <H2>5. Cookie Policy</H2>
          <P>
            We use cookies that are strictly necessary for authentication and
            session persistence (e.g.&nbsp;to keep you signed in as you navigate
            the dashboard).
          </P>

          <H2>6. Data Retention</H2>
          <P>
            Email addresses and usage credits are retained for as long as your
            account remains active. You may delete your account at any time from
            the <em>Dashboard {">"} Settings</em> page, which will permanently
            remove your personal data.
          </P>

          <H2>8. Contact</H2>
          <P>
            If you have any questions or concerns about this Privacy Policy,
            email us at{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>.
          </P>
        </div>
      </div>
    </PageTransition>
  );
}
