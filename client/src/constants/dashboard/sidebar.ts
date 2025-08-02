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
