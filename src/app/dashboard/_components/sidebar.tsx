"use client";

import Link from "next/link";
import {
  PhotoIcon,
  CogIcon,
  HomeIcon,
  CreditCardIcon,
  ArrowUpIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isActive,
}: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const isDashboardActive = pathname === "/dashboard";
  const isRemoveBackgroundActive = pathname.startsWith(
    "/dashboard/remove-background"
  );
  const isUpscaleActive = pathname.startsWith("/dashboard/upscale");
  const isEditImageActive = pathname.startsWith("/dashboard/edit-image");
  const isBillingActive = pathname.startsWith("/dashboard/billing");
  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  return (
    <aside className="w-56 min-w-56 h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          <SidebarLink
            href="/dashboard"
            icon={HomeIcon}
            label="Dashboard"
            isActive={isDashboardActive}
          />
          <SidebarLink
            href="/dashboard/remove-background"
            icon={PhotoIcon}
            label="Remove Background"
            isActive={isRemoveBackgroundActive}
          />
          <SidebarLink
            href="/dashboard/upscale"
            icon={ArrowUpIcon}
            label="Upscale Image"
            isActive={isUpscaleActive}
          />
          <SidebarLink
            href="/dashboard/edit-image"
            icon={PencilIcon}
            label="Edit Image"
            isActive={isEditImageActive}
          />
        </div>
        <div className="mt-auto space-y-2">
          <SidebarLink
            href="/dashboard/billing"
            icon={CreditCardIcon}
            label="Billing"
            isActive={isBillingActive}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={CogIcon}
            label="Settings"
            isActive={isSettingsActive}
          />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
