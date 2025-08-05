// import ThemeToggle from "@/components/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { Muted, Small } from "../ui/typography";
import { Link } from "@/components/links";

export default function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 text-sm">
          <Link href={ROUTES.PRIVACY_POLICY}>
            <Small>Privacy Policy</Small>
          </Link>
          <Link href={ROUTES.TERMS_OF_SERVICE}>
            <Small>Terms of Service</Small>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Muted>
            © {new Date().getFullYear()} imagify.pro. All rights reserved.
          </Muted>
        </div>
      </div>
    </footer>
  );
}
