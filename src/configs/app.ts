import { Geist } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const CONTACT_EMAIL = "support@imagify.pro";

export const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  PRICING: "/pricing",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  CONTACT: "/contact",
  DASHBOARD: "/dashboard",
  BLOG: "/blog",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD_COMPRESS_IMAGE: "/dashboard/compress-image",
  DASHBOARD_CONVERT_FORMAT: "/dashboard/convert-format",
  DASHBOARD_EDIT_IMAGE: "/dashboard/edit-image",
  DASHBOARD_EXTRACT_TEXT: "/dashboard/extract-text",
  DASHBOARD_GENERATE_IMAGE: "/dashboard/generate-image",
  DASHBOARD_REMOVE_BACKGROUND: "/dashboard/remove-background",
  DASHBOARD_UPSCALE: "/dashboard/upscale",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_BILLING: "/dashboard/billing",
};
