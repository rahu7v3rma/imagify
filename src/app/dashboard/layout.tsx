"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user/provider";
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
import { ROUTES } from "@/constants/routes";

function Header() {
  const router = useRouter();
  const { logout } = useUser();

  return (
    <header className="w-full backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p
            className="font-bold text-lg cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            imagify.pro
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD.BILLING)}
            className="text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            {0} credits
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem
                onClick={() => router.push(ROUTES.DASHBOARD.SETTINGS)}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
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

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full px-4 pb-4">
        <div className="space-y-2">
          <Button
            size="sm"
            variant={pathname === ROUTES.DASHBOARD.ROOT ? "default" : "ghost"}
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              className="flex items-center space-x-3 w-full"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.GENERATE_IMAGE ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.GENERATE_IMAGE}
              className="flex items-center space-x-3 w-full"
            >
              <Sparkles className="h-5 w-5" />
              <span>Generate Image</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.REMOVE_BACKGROUND
                ? "default"
                : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.REMOVE_BACKGROUND}
              className="flex items-center space-x-3 w-full"
            >
              <Image className="h-5 w-5" />
              <span>Remove Background</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.EXTRACT_TEXT ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.EXTRACT_TEXT}
              className="flex items-center space-x-3 w-full"
            >
              <FileText className="h-5 w-5" />
              <span>Extract Text</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.UPSCALE ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.UPSCALE}
              className="flex items-center space-x-3 w-full"
            >
              <ArrowUp className="h-5 w-5" />
              <span>Upscale Image</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.COMPRESS_IMAGE ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.COMPRESS_IMAGE}
              className="flex items-center space-x-3 w-full"
            >
              <Archive className="h-5 w-5" />
              <span>Compress Image</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.CONVERT_FORMAT ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.CONVERT_FORMAT}
              className="flex items-center space-x-3 w-full"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Convert Format</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.EDIT_IMAGE ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.EDIT_IMAGE}
              className="flex items-center space-x-3 w-full"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Image</span>
            </Link>
          </Button>
        </div>
        <div className="mt-auto space-y-2">
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.BILLING ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.BILLING}
              className="flex items-center space-x-3 w-full"
            >
              <CreditCard className="h-5 w-5" />
              <span>Billing</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.SETTINGS ? "default" : "ghost"
            }
            className="w-full"
          >
            <Link
              href={ROUTES.DASHBOARD.SETTINGS}
              className="flex items-center space-x-3 w-full"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
