import RootLayoutComponent from '@/components/layouts/app';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootLayoutComponent>{children}</RootLayoutComponent>;
}
