"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MotionButton } from "@/components/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Image,
  Settings,
  Home,
  CreditCard,
  ArrowUp,
  Edit,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

const ACTION_KEYS = {
  SETTINGS: "settings",
  LOGOUT: "logout",
};

function Header() {
  const router = useRouter();

  const logout = async () => {};

  const handleProfileAction = (actionKey: string) => {
    if (actionKey === ACTION_KEYS.SETTINGS) {
      router.push("/dashboard/settings");
    }
    if (actionKey === ACTION_KEYS.LOGOUT) {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="w-full backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push("/")}
          >
            imagify.pro
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <MotionButton
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/billing")}
            className="text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {0} credits
          </MotionButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MotionButton
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </MotionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem
                onClick={() => handleProfileAction(ACTION_KEYS.SETTINGS)}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileAction(ACTION_KEYS.LOGOUT)}
                className="text-red-600 focus:text-red-600"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

const SIDEBAR_SECTIONS = {
  MAIN: "main",
  BOTTOM: "bottom",
};

const SIDEBAR_LINKS = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    label: "Generate Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/remove-background",
    icon: Image,
    label: "Remove Background",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    label: "Extract Text",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    label: "Upscale Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    label: "Compress Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    label: "Convert Format",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    label: "Edit Image",
    section: SIDEBAR_SECTIONS.MAIN,
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    label: "Billing",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    section: SIDEBAR_SECTIONS.BOTTOM,
  },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full px-4 pb-4">
        <div className="space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.MAIN,
          ).map(({ icon: Icon, href, label }) => (
            <MotionButton
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </MotionButton>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          {SIDEBAR_LINKS.filter(
            (link) => link.section === SIDEBAR_SECTIONS.BOTTOM,
          ).map(({ icon: Icon, href, label }) => (
            <MotionButton
              key={href}
              size="sm"
              variant={pathname === href ? "default" : "ghost"}
              className="w-full"
            >
              <Link href={href} className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </MotionButton>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-[8%]">
        <Header />
      </div>
      <div className="flex h-[92%] w-full">
        <Sidebar />
        <main className="p-4 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
