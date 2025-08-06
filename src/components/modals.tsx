"use client";

import * as React from "react";
import { MotionButton } from "@/components/buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <MotionButton variant="outline" onClick={onClose}>
            Cancel
          </MotionButton>
          <MotionButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </MotionButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
