import PageTransition from '@/components/shared/transitions';
import { H1, List } from '@/components/ui/typography';

export default function TermsOfServicePage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mt-10" />
        <div className="max-w-3xl mx-auto space-y-6">
          <H1>Terms of Service</H1>
          <List
            options={[
              'We use credit based system to use our services which is described in our pricing page',
              'You are responsible for your content',
              'You control the ownership of your generated content',
              'We reserve the right to terminate your account at any time',
              'We reserve the right to change our terms of service at any time',
              'We reserve the right to change our pricing at any time',
              'We reserve the right to change our services at any time',
            ]}
          />
        </div>
      </div>
    </PageTransition>
  );
}
