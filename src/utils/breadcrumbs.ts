
export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export const BREADCRUMB_ITEMS = {
  BLOG: [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ] as BreadcrumbItem[],
  CONTACT: [
    { label: "Home", href: "/" },
    { label: "Contact" },
  ] as BreadcrumbItem[],
  PRICING: [
    { label: "Home", href: "/" },
    { label: "Pricing" },
  ] as BreadcrumbItem[],
  PRIVACY_POLICY: [
    { label: "Home", href: "/" },
    { label: "Privacy Policy" },
  ] as BreadcrumbItem[],
  TERMS_OF_SERVICE: [
    { label: "Home", href: "/" },
    { label: "Terms of Service" },
  ] as BreadcrumbItem[],
};