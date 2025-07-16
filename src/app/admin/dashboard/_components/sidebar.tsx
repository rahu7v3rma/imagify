"use client";

import Link from "next/link";
import {
  DocumentTextIcon,
  HomeIcon,
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

const AdminSidebar = () => {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/admin/dashboard";
  const isBlogActive = pathname.startsWith("/admin/dashboard/blog");

  return (
    <aside className="w-56 min-w-56 h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          <SidebarLink
            href="/admin/dashboard"
            icon={HomeIcon}
            label="Dashboard"
            isActive={isDashboardActive}
          />
          <SidebarLink
            href="/admin/dashboard/blog"
            icon={DocumentTextIcon}
            label="Blog"
            isActive={isBlogActive}
          />
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 