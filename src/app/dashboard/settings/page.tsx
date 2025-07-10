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
import { deleteCurrentUser, getUserCents, db } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SettingsPage() {
  const { user, setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleThemeToggle = (isSelected: boolean) => {
    setMode(isSelected ? "dark" : "light");
  };

  const downloadMyData = async () => {
    if (!user) {
      addToast({
        title: "No user logged in",
        color: "danger",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Gather user data
      const userData: any = {
        account: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        exportedAt: new Date().toISOString(),
      };

      // Get user cents data
      try {
        const userCents = await getUserCents(user.uid);
        userData.credits = userCents;
      } catch (error) {
        console.warn("Could not fetch user cents:", error);
        userData.credits = null;
      }

      // Get contact messages sent by this user
      try {
        const contactQuery = query(
          collection(db, "contact_us_messages"),
          where("email", "==", user.email)
        );
        const contactSnapshot = await getDocs(contactQuery);
        userData.contactMessages = contactSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.warn("Could not fetch contact messages:", error);
        userData.contactMessages = [];
      }

      // Create and download JSON file
      const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/json",
      });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        title: "Data exported successfully!",
        color: "success",
      });
    } catch (error) {
      console.error("Error downloading data:", error);
      addToast({
        title: "Failed to export data",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>

      <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
        <Tab key="account" title="Account">
          <div className="py-4 space-y-4">
            <Button 
              color="primary" 
              variant="bordered" 
              onPress={downloadMyData}
              startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
            >
              Download My Data
            </Button>
            <Button color="danger" variant="bordered" onPress={onOpen}>
              Delete Account
            </Button>
          </div>
        </Tab>
        <Tab key="preferences" title="Preferences">
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
