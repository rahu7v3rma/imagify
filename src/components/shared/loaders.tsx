import { Loader2 } from 'lucide-react';
import { P } from '@/components/ui/typography';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/common';

export const WithLoader = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <P>{text}</P>
  );
};

export const WithLoaderNode = ({
  content,
  isLoading,
}: {
  content: React.ReactNode;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <>{content}</>
  );
};

export const WithLoaderNodeSafe = ({
  content,
  fallback,
  isLoading,
}: {
  content: React.ReactNode;
  fallback: React.ReactNode;
  isLoading: boolean;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <>{content}</>
  );
};

export const Spinner = ({
  size = 'default',
  className = '',
}: {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2
      className={cn(sizeClasses[size], 'animate-spin text-gray-500', className)}
    />
  );
};
