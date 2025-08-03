import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { Muted, Small } from "../ui/typography";

export default function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 text-sm">
          <Link
            href={ROUTES.PRIVACY_POLICY}
            className="hover:text-primary transition-colors"
          >
            <Small>Privacy Policy</Small>
          </Link>
          <Link
            href={ROUTES.TERMS_OF_SERVICE}
            className="hover:text-primary transition-colors"
          >
            <Small>Terms of Service</Small>
          </Link>
        </div>

        <Muted>
          © {new Date().getFullYear()} imagify.pro. All rights reserved.
        </Muted>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
