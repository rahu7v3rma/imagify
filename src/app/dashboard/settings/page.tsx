"use client";

import ConfirmationModal from "@/components/modals";
import { Button } from "@/components/buttons";
import { useState } from "react";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-row gap-4 items-center">
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          Delete Account
        </Button>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {}}
        title="Confirm Account Deletion"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed."
      />
    </div>
  );
}
