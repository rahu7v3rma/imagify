import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/privacy-policy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>

        </div>

        <div className="text-sm text-default-500">
          © {new Date().getFullYear()} imagify.pro. All rights reserved.
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
