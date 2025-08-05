"use client";

import { Button } from "@/components/buttons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image,
  Settings,
  Home,
  CreditCard,
  ArrowUp,
  Edit,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";

export const SIDEBAR_SECTIONS = {
  MAIN: "main",
  BOTTOM: "bottom",
};

export const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    label: "Generate Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/remove-background",
    icon: Image,
    label: "Remove Background",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    label: "Extract Text",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    label: "Upscale Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    label: "Compress Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    label: "Convert Format",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    label: "Edit Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    label: "Billing",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full px-4 pb-4">
        <div className="space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.MAIN
          ).map(({ icon: Icon, href, label }) => (
            <Button
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.BOTTOM
          ).map(({ icon: Icon, href, label }) => (
            <Button
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
