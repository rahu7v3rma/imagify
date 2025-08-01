import {
  PhotoIcon,
  CogIcon,
  HomeIcon,
  CreditCardIcon,
  ArrowUpIcon,
  PencilIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const SIDEBAR_SECTIONS = {
  MAIN: "main",
  BOTTOM: "bottom",
};

export const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    icon: HomeIcon,
    label: "Dashboard",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/generate-image",
    icon: SparklesIcon,
    label: "Generate Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/remove-background",
    icon: PhotoIcon,
    label: "Remove Background",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/extract-text",
    icon: DocumentTextIcon,
    label: "Extract Text",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUpIcon,
    label: "Upscale Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/compress-image",
    icon: ArchiveBoxArrowDownIcon,
    label: "Compress Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/convert-format",
    icon: ArrowPathIcon,
    label: "Convert Format",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/edit-image",
    icon: PencilIcon,
    label: "Edit Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/billing",
    icon: CreditCardIcon,
    label: "Billing",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
  {
    href: "/dashboard/settings",
    icon: CogIcon,
    label: "Settings",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
];
