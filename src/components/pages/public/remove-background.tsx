import PageTransition from '@/components/shared/transitions';
import { H1, Muted } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';

export default function RemoveBackgroundPage() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12 mt-12">
          <H1>Remove background</H1>
          <Muted>Remove backgrounds from images instantly</Muted>
          <div className="mt-2">
            <Badge variant="default" className="text-xs">
              💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
            </Badge>
          </div>
        </div>

        {/* Tool Description Section */}
        <div className="flex gap-8 items-start max-w-3xl w-full">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-base">AI-Powered Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithms detect and remove backgrounds
                  automatically
                </p>
              </div>

              <div>
                <h4 className="font-medium text-base">Two Processing Modes</h4>
                <p className="text-sm text-muted-foreground">
                  Fast mode for quick results, Standard for higher quality
                </p>
              </div>

              <div>
                <h4 className="font-medium text-base">
                  Multiple Upload Options
                </h4>
                <p className="text-sm text-muted-foreground">
                  Upload files directly or provide image URLs
                </p>
              </div>

              <div>
                <h4 className="font-medium text-base">Instant Download</h4>
                <p className="text-sm text-muted-foreground">
                  Get transparent PNG files ready for use
                </p>
              </div>
            </div>
          </div>
          <div className="w-40 flex-shrink-0">
            <img
              src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@2x.png"
              alt="Wikipedia Logo"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
