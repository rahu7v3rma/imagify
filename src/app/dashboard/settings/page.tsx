"use client";

import {
  Tabs,
  Tab,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
} from "@heroui/react";
import { deleteCurrentUser, deleteUserCents } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import { useTheme } from "@/context/theme";
import {
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { user, setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleThemeToggle = (isSelected: boolean) => {
    setMode(isSelected ? "dark" : "light");
  };

  const deleteAccount = async () => {
    if (!user) {
      addToast({
        title: "No user logged in",
        color: "danger",
      });
      return false;
    }

    try {
      setIsLoading(true);

      // Delete user cents document first
      try {
        await deleteUserCents(user.uid);
      } catch (error) {
        console.warn("Could not delete user cents:", error);
        // Continue with account deletion even if user cents deletion fails
      }

      // Delete the user account
      await deleteCurrentUser();
      setUser(null);
      addToast({
        title: "Account deleted successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/requires-recent-login") {
          addToast({
            title: "Please log in again to delete your account",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to delete account",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      router.push("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>

      <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
        <Tab key="account" title="Account">
          <div className="py-4">
            <div className="flex flex-row gap-4 items-center">
              <Button
                color="danger"
                variant="bordered"
                onPress={onOpen}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Tab>
        {/* <Tab key="preferences" title="Preferences">
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switch between light and dark mode
                  </p>
                </div>
                <Switch
                  isSelected={mode === "dark"}
                  onValueChange={handleThemeToggle}
                  size="lg"
                  color="primary"
                  startContent={<SunIcon className="w-4 h-4" />}
                  endContent={<MoonIcon className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </Tab> */}
      </Tabs>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Account Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete your account? This action
                  cannot be undone. All your data will be permanently removed.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteAccount();
                    onClose();
                  }}
                >
                  Delete Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
