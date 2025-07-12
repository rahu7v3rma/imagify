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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSearch } from "@/context/search";
import { useState, useEffect } from "react";

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
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const isDashboardActive = pathname === "/dashboard";
  const isGenerateImageActive = pathname.startsWith("/dashboard/generate-image");
  const isRemoveBackgroundActive = pathname.startsWith(
    "/dashboard/remove-background"
  );
  const isExtractTextActive = pathname.startsWith("/dashboard/extract-text");
  const isUpscaleActive = pathname.startsWith("/dashboard/upscale");
  const isEditImageActive = pathname.startsWith("/dashboard/edit-image");
  const isCompressImageActive = pathname.startsWith("/dashboard/compress-image");
  const isBillingActive = pathname.startsWith("/dashboard/billing");
  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  // Define all navigation items
  const navigationItems = [
    {
      href: "/dashboard",
      icon: HomeIcon,
      label: "Dashboard",
      isActive: isDashboardActive,
      category: "main",
    },
    {
      href: "/dashboard/generate-image",
      icon: SparklesIcon,
      label: "Generate Image",
      isActive: isGenerateImageActive,
      category: "service",
    },
    {
      href: "/dashboard/remove-background",
      icon: PhotoIcon,
      label: "Remove Background",
      isActive: isRemoveBackgroundActive,
      category: "service",
    },
    {
      href: "/dashboard/extract-text",
      icon: DocumentTextIcon,
      label: "Extract Text",
      isActive: isExtractTextActive,
      category: "service",
    },
    {
      href: "/dashboard/upscale",
      icon: ArrowUpIcon,
      label: "Upscale Image",
      isActive: isUpscaleActive,
      category: "service",
    },
    {
      href: "/dashboard/compress-image",
      icon: ArchiveBoxArrowDownIcon,
      label: "Compress Image",
      isActive: isCompressImageActive,
      category: "service",
    },
    {
      href: "/dashboard/edit-image",
      icon: PencilIcon,
      label: "Edit Image",
      isActive: isEditImageActive,
      category: "service",
    },
  ];

  const bottomNavigationItems = [
    {
      href: "/dashboard/billing",
      icon: CreditCardIcon,
      label: "Billing",
      isActive: isBillingActive,
      category: "other",
    },
    {
      href: "/dashboard/settings",
      icon: CogIcon,
      label: "Settings",
      isActive: isSettingsActive,
      category: "other",
    },
  ];

  // Filter navigation items based on search term
  const filteredNavigationItems = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  const filteredBottomNavigationItems = bottomNavigationItems.filter((item) =>
    item.label.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  // Update global search term with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, setSearchTerm]);

  return (
    <aside className="w-56 min-w-56 h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800">
      <nav className="flex flex-col h-full p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredNavigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
            />
          ))}
        </div>

        <div className="mt-auto space-y-2">
          {filteredBottomNavigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
