"use client";

import Link from "next/link";
import { CalendarIcon, CogIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const isSchedulingActive = pathname.startsWith("/dashboard/scheduling");
  const isSettingsActive = pathname.startsWith("/dashboard/settings");
  return (
    <aside className="w-56 h-full border-r border-gray-200 bg-white">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          <Link
            href="/dashboard/scheduling"
            className={`flex items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium ${
              isSchedulingActive
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Scheduling</span>
          </Link>
        </div>
        <div className="mt-auto">
          <Link
            href="/dashboard/settings"
            className={`flex items-center space-x-3 rounded-md px-2 py-2 text-sm font-medium ${
              isSettingsActive
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CogIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
