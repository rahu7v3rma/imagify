"use client";

import Link from "next/link";
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
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Key } from "react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
}

interface SidebarItem {
  key: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
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
  const router = useRouter();
  
  const isDashboardActive = pathname === "/dashboard";
  const isGenerateImageActive = pathname.startsWith(
    "/dashboard/generate-image",
  );
  const isRemoveBackgroundActive = pathname.startsWith(
    "/dashboard/remove-background",
  );
  const isExtractTextActive = pathname.startsWith("/dashboard/extract-text");
  const isUpscaleActive = pathname.startsWith("/dashboard/upscale");
  const isEditImageActive = pathname.startsWith("/dashboard/edit-image");
  const isCompressImageActive = pathname.startsWith(
    "/dashboard/compress-image",
  );
  const isBillingActive = pathname.startsWith("/dashboard/billing");
  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  const quickNavItems: SidebarItem[] = [
    {
      key: "dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      label: "Dashboard"
    },
    {
      key: "generate-image",
      href: "/dashboard/generate-image",
      icon: SparklesIcon,
      label: "Generate Image"
    },
    {
      key: "remove-background",
      href: "/dashboard/remove-background",
      icon: PhotoIcon,
      label: "Remove Background"
    },
    {
      key: "extract-text",
      href: "/dashboard/extract-text",
      icon: DocumentTextIcon,
      label: "Extract Text"
    },
    {
      key: "upscale",
      href: "/dashboard/upscale",
      icon: ArrowUpIcon,
      label: "Upscale Image"
    },
    {
      key: "compress-image",
      href: "/dashboard/compress-image",
      icon: ArchiveBoxArrowDownIcon,
      label: "Compress Image"
    },
    {
      key: "edit-image",
      href: "/dashboard/edit-image",
      icon: PencilIcon,
      label: "Edit Image"
    }
  ];

  // Find the currently selected item based on pathname
  const getCurrentSelectedKey = () => {
    const currentItem = quickNavItems.find(item => {
      if (item.href === "/dashboard") {
        return pathname === "/dashboard";
      }
      return pathname.startsWith(item.href);
    });
    return currentItem?.key || "";
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key) {
      const selectedItem = quickNavItems.find(item => item.key === key);
      if (selectedItem) {
        router.push(selectedItem.href);
      }
    }
  };

  return (
    <aside className="w-56 min-w-56 h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800">
      <nav className="flex flex-col h-full p-4">
        {/* Autocomplete Navigation */}
        <div className="mb-6">
          <Autocomplete
            label="Quick Navigation"
            placeholder="Search or select a page..."
            selectedKey={getCurrentSelectedKey()}
            onSelectionChange={handleSelectionChange}
            className="w-full"
            variant="bordered"
            size="sm"
          >
            {quickNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <AutocompleteItem
                  key={item.key}
                  startContent={<Icon className="h-4 w-4" />}
                >
                  {item.label}
                </AutocompleteItem>
              );
            })}
          </Autocomplete>
        </div>

        {/* Traditional Sidebar Links */}
        <div className="space-y-2">
          <SidebarLink
            href="/dashboard"
            icon={HomeIcon}
            label="Dashboard"
            isActive={isDashboardActive}
          />
          <SidebarLink
            href="/dashboard/generate-image"
            icon={SparklesIcon}
            label="Generate Image"
            isActive={isGenerateImageActive}
          />
          <SidebarLink
            href="/dashboard/remove-background"
            icon={PhotoIcon}
            label="Remove Background"
            isActive={isRemoveBackgroundActive}
          />
          <SidebarLink
            href="/dashboard/extract-text"
            icon={DocumentTextIcon}
            label="Extract Text"
            isActive={isExtractTextActive}
          />
          <SidebarLink
            href="/dashboard/upscale"
            icon={ArrowUpIcon}
            label="Upscale Image"
            isActive={isUpscaleActive}
          />
          <SidebarLink
            href="/dashboard/compress-image"
            icon={ArchiveBoxArrowDownIcon}
            label="Compress Image"
            isActive={isCompressImageActive}
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
