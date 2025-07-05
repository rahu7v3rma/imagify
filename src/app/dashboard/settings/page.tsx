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
} from "@heroui/react";
import { deleteCurrentUser } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";

export default function SettingsPage() {
  const { setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteAccount = async () => {
    try {
      setIsLoading(true);
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
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
        <Tab key="account" title="Account">
          <div className="py-4">
            <Button color="danger" variant="bordered" onPress={onOpen}>
              Delete Account
            </Button>
          </div>
        </Tab>
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
