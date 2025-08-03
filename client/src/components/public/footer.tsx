import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes";

export default function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 text-sm">
          <Link
            href={ROUTES.PRIVACY_POLICY}
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href={ROUTES.TERMS_OF_SERVICE}
            className="hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} imagify.pro. All rights reserved.
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
