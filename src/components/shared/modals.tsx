'use client';

import * as React from 'react';
import { Button, IconButton } from '@/components/shared/buttons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WithLoader } from '@/components/shared/loaders';
import { X } from 'lucide-react';

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
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}) {
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
