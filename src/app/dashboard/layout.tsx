"use client";

import { Button } from "@/components/buttons";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/context/user/provider";
import {
  Archive,
  ArrowUp,
  CreditCard,
  Edit,
  FileText,
  Home,
  Image,
  LogOut,
  RotateCcw,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import PageTransition from "@/components/transitions";
import { WithLoaderNodeSafe } from "@/components/loaders";

function Header() {
  const router = useRouter();
  const { userProfile, isLoading } = useUser();

  return (
    <header className="w-full backdrop-blur-sm border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <div
            className="cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            <Logo />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD.BILLING)}
            className="text-sm font-medium"
          >
            <Zap className="w-4 h-4 mr-2" />
            <WithLoaderNodeSafe
              content={`${userProfile?.credits ?? 0} credits`}
              fallback="0 credits"
              isLoading={isLoading}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { logout } = useUser();

  return (
    <aside className="w-56 min-w-56 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-1">
          <Button
            size="sm"
            variant={pathname === ROUTES.DASHBOARD.ROOT ? "default" : "outline"}
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
              pathname === ROUTES.DASHBOARD.GENERATE_IMAGE
                ? "default"
                : "outline"
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
                : "outline"
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
              pathname === ROUTES.DASHBOARD.EXTRACT_TEXT ? "default" : "outline"
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
              pathname === ROUTES.DASHBOARD.UPSCALE ? "default" : "outline"
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
              pathname === ROUTES.DASHBOARD.COMPRESS_IMAGE
                ? "default"
                : "outline"
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
              pathname === ROUTES.DASHBOARD.CONVERT_FORMAT
                ? "default"
                : "outline"
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
              pathname === ROUTES.DASHBOARD.EDIT_IMAGE ? "default" : "outline"
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
        <div className="mt-auto space-y-1">
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.BILLING ? "default" : "outline"
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
              pathname === ROUTES.DASHBOARD.SETTINGS ? "default" : "outline"
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
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            <div className="flex items-center space-x-3 w-full">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </div>
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
    <PageTransition>
      <div className="h-screen flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex flex-1 w-full">
          <Sidebar />
          <main className="p-10 w-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </PageTransition>
  );
}
