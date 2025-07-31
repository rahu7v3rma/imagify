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

export const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    icon: HomeIcon,
    label: "Dashboard",
    section: "main",
  },
  {
    href: "/dashboard/generate-image",
    icon: SparklesIcon,
    label: "Generate Image",
    section: "main",
  },
  {
    href: "/dashboard/remove-background",
    icon: PhotoIcon,
    label: "Remove Background",
    section: "main",
  },
  {
    href: "/dashboard/extract-text",
    icon: DocumentTextIcon,
    label: "Extract Text",
    section: "main",
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUpIcon,
    label: "Upscale Image",
    section: "main",
  },
  {
    href: "/dashboard/compress-image",
    icon: ArchiveBoxArrowDownIcon,
    label: "Compress Image",
    section: "main",
  },
  {
    href: "/dashboard/convert-format",
    icon: ArrowPathIcon,
    label: "Convert Format",
    section: "main",
  },
  {
    href: "/dashboard/edit-image",
    icon: PencilIcon,
    label: "Edit Image",
    section: "main",
  },
  {
    href: "/dashboard/billing",
    icon: CreditCardIcon,
    label: "Billing",
    section: "bottom",
  },
  {
    href: "/dashboard/settings",
    icon: CogIcon,
    label: "Settings",
    section: "bottom",
  },
];
