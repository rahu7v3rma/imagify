'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/theme';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { mode, setMode } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (checked: boolean) => {
    setMode(checked ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Sun className="h-4 w-4" />
        <Switch checked={false} onCheckedChange={() => {}} />
        <Moon className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch checked={mode === 'dark'} onCheckedChange={handleToggle} />
      <Moon className="h-4 w-4" />
    </div>
  );
}
