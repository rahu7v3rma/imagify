'use client';

import { Button, IconButton } from '@/components/shared/buttons';
import { ROUTES } from '@/constants/routes';
import { useUser } from '@/context/user/provider';
import {
  Archive,
  ArrowUp,
  CreditCard,
  Crop,
  Edit,
  FileText,
  Home,
  Image,
  LogOut,
  Maximize,
  RefreshCw,
  RotateCcw,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/logo';
import PageTransition from '@/components/shared/transitions';
import { WithLoaderNodeSafe } from '@/components/shared/loaders';
import { useState } from 'react';
import { TextInput } from '@/components/shared/inputs';

function Header() {
  const router = useRouter();
  const { userProfile, isLoading, fetchUserProfile } = useUser();

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
          <IconButton
            onClick={fetchUserProfile}
            size="sm"
            className="w-8 h-8"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const { logout } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  const navigationButtons = [
    { href: ROUTES.DASHBOARD.ROOT, icon: Home, label: 'Dashboard' },
    {
      href: ROUTES.DASHBOARD.GENERATE_IMAGE,
      icon: Sparkles,
      label: 'Generate Image',
    },
    {
      href: ROUTES.DASHBOARD.REMOVE_BACKGROUND,
      icon: Image,
      label: 'Remove Background',
    },
    {
      href: ROUTES.DASHBOARD.EXTRACT_TEXT,
      icon: FileText,
      label: 'Extract Text',
    },
    { href: ROUTES.DASHBOARD.UPSCALE, icon: ArrowUp, label: 'Upscale Image' },
    {
      href: ROUTES.DASHBOARD.COMPRESS_IMAGE,
      icon: Archive,
      label: 'Compress Image',
    },
    {
      href: ROUTES.DASHBOARD.CONVERT_FORMAT,
      icon: RotateCcw,
      label: 'Convert Format',
    },
    {
      href: ROUTES.DASHBOARD.RESIZE_IMAGE,
      icon: Maximize,
      label: 'Resize Image',
    },
    { href: ROUTES.DASHBOARD.EDIT_IMAGE, icon: Edit, label: 'Edit Image' },
    {
      href: ROUTES.DASHBOARD.CROP_ROTATE_FLIP,
      icon: Crop,
      label: 'Crop-Rotate-Flip Image',
    },
  ];

  const filteredButtons = navigationButtons.filter((button) =>
    button.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <aside className="w-76 min-w-76 h-full border-r border-border bg-background">
      <nav className="flex flex-col h-full p-4">
        <div className="mb-4">
          <TextInput
            placeholder="Search tools"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          {filteredButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <Button
                key={button.href}
                size="sm"
                variant={pathname === button.href ? 'default' : 'outline'}
                className="w-full"
              >
                <Link
                  href={button.href}
                  className="flex items-center space-x-3 w-full"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{button.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
        <div className="mt-auto space-y-1">
          <Button
            size="sm"
            variant={
              pathname === ROUTES.DASHBOARD.BILLING ? 'default' : 'outline'
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
              pathname === ROUTES.DASHBOARD.SETTINGS ? 'default' : 'outline'
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
      <div className="h-screen flex flex-col overflow-hidden">
        <div>
          <Header />
        </div>
        <div className="flex flex-1 w-full overflow-hidden">
          <Sidebar />
          <main className="p-10 w-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </PageTransition>
  );
}
