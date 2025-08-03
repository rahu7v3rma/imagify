"use client";

import { Button } from "@/components/buttons";
import { SIDEBAR_LINKS, SIDEBAR_SECTIONS } from "@/constants/dashboard/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full px-4 pb-4">
        <div className="space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.MAIN
          ).map(({ icon: Icon, href, label }) => (
            <Button
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.BOTTOM
          ).map(({ icon: Icon, href, label }) => (
            <Button
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
