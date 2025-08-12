"use client";

import * as React from "react";
import { Button } from "@/components/buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WithLoader } from "@/components/loaders";

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
            {WithLoader({ text: "Confirm", isLoading: loading })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
