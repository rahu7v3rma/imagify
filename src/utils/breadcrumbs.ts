import { ROUTES } from "@/configs/app";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export const BREADCRUMB_ITEMS = {
  BLOG: [
    { label: "Home", href: ROUTES.HOME },
    { label: "Blog" },
  ] as BreadcrumbItem[],
  CONTACT: [
    { label: "Home", href: ROUTES.HOME },
    { label: "Contact" },
  ] as BreadcrumbItem[],
  PRICING: [
    { label: "Home", href: ROUTES.HOME },
    { label: "Pricing" },
  ] as BreadcrumbItem[],
  PRIVACY_POLICY: [
    { label: "Home", href: ROUTES.HOME },
    { label: "Privacy Policy" },
  ] as BreadcrumbItem[],
  TERMS_OF_SERVICE: [
    { label: "Home", href: ROUTES.HOME },
    { label: "Terms of Service" },
  ] as BreadcrumbItem[],
};