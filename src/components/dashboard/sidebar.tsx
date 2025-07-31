"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_LINKS } from "@/constants/dashboard/sidebar";
import clsx from "clsx";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          {SIDEBAR_LINKS.filter((link) => link.section === "main").map(
            ({ icon: Icon, href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            )
          )}
        </div>
        <div className="mt-auto space-y-2">
          {SIDEBAR_LINKS.filter((link) => link.section === "bottom").map(
            ({ icon: Icon, href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            )
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
