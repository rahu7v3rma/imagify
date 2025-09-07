'use client';

import * as React from 'react';
import { Button, IconButton, WhiteButton } from '@/components/shared/buttons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WithLoader } from '@/components/shared/loaders';
import { downloadImage } from '@/utils/common';
import { X } from 'lucide-react';
import { parseDataUri } from '@/utils/image';
import { trpc } from '@/lib/trpc/client';
import { toast } from 'sonner';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  disabled = false,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={disabled}>
            {WithLoader({ text: 'Confirm', isLoading: loading })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ExpandedPreviewImage({
  isOpen,
  onClose,
  src,
  fileId,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  fileId?: number | null;
}) {
  const { mutate: generateShareUrl, isPending: isGeneratingShareUrl } =
    trpc.shareImage.generateShareUrl.useMutation({
      onSuccess: (data) => {
        navigator.clipboard.writeText(data.shareUrl);
        toast.success('Share URL copied to clipboard!');
      },
      onError: () => {
        toast.error('Failed to generate share URL. Please try again.');
      },
    });

  const handleDownload = () => {
    const { format } = parseDataUri(src);
    downloadImage(src, format, 'image');
  };

  const handleShare = async () => {
    if (fileId) {
      generateShareUrl({ fileId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] h-[80vh] max-w-none p-0 border-0">
        <DialogTitle className="sr-only">Expanded Image Preview</DialogTitle>
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <IconButton
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="h-6 w-6" />
            </IconButton>
          </div>
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <WhiteButton onClick={handleDownload}>Download</WhiteButton>
            {fileId && (
              <WhiteButton
                onClick={handleShare}
                disabled={isGeneratingShareUrl}
              >
                {WithLoader({ text: 'Share', isLoading: isGeneratingShareUrl })}
              </WhiteButton>
            )}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Expanded preview"
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
