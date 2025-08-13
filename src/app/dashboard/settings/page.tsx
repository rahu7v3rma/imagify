"use client";

import ConfirmationModal from "@/components/modals";
import { Button } from "@/components/buttons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { TabLink } from "@/components/links";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useUser } from "@/context/user/provider";
import PageTransition from "@/components/transitions";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useUser();

  const { mutate: deleteAccount, isPending } =
    trpc.settings.deleteAccount.useMutation({
      onSuccess: (ok) => {
        if (ok) {
          setIsOpen(false);
          logout();
        }
      },
    });

  return (
    <PageTransition>
      <div className="">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="account" className="max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">
              <TabLink>Account</TabLink>
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <TabLink>Preferences</TabLink>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="flex flex-row gap-4 items-center pt-2">
              <Button variant="destructive" onClick={() => setIsOpen(true)}>
                Delete Account
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            {/* <div className="pt-2 space-y-4"> */}
            {/* Dark Mode toggle intentionally disabled for now */}
            {/* <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <ThemeToggle />
              </div> */}
            {/* </div> */}
          </TabsContent>
        </Tabs>

        <ConfirmationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => deleteAccount()}
          title="Confirm Account Deletion"
          message="Are you sure you want to delete your account? This action cannot be undone."
          disabled={isPending}
          loading={isPending}
        />
      </div>
    </PageTransition>
  );
}
