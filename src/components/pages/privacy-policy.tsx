import PageTransition from '@/components/shared/transitions';
import { H1, List } from '@/components/ui/typography';

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mt-10" />
        <div className="max-w-3xl mx-auto space-y-6">
          <H1>Privacy Policy</H1>
          <List
            options={[
              'We collect email address for authentication and notifications',
              'We do not collect your images and prompts',
              'We do not collect your payment information, which is handled by Paypal',
              'We save cookies for authentication',
              'You can delete your account at any time',
            ]}
          />
        </div>
      </div>
    </PageTransition>
  );
}
