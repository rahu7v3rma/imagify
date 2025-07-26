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
  Card,
  CardBody,
} from "@heroui/react";
import { CustomInput } from "@/components/ui/input";
// import { deleteCurrentUser, deleteUserCredits, updateUserEmail } from "@/lib/firebase";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import Cookies from "js-cookie";
import { useTheme } from "@/context/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailSchema = z.infer<typeof emailSchema>;

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const { setIsLoading } = useLoader();
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      email: user?.email || "",
    },
  });

  const handleThemeToggle = (isSelected: boolean) => {
    setMode(isSelected ? "dark" : "light");
  };

  const onSubmitEmail = async (data: EmailSchema) => {
    if (!user) {
      addToast({
        title: "No user logged in",
        color: "danger",
      });
      return;
    }

    try {
      setIsLoading(true);
      // await updateUserEmail(data.email);
      addToast({
        title: "Verification email sent! Please check your new email address.",
        color: "success",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/requires-recent-login") {
          addToast({
            title: "Please log in again to update your email",
            color: "danger",
          });
        } else if (error.code === "auth/email-already-in-use") {
          addToast({
            title: "This email is already in use by another account",
            color: "danger",
          });
        } else {
          addToast({
            title: "Failed to update email",
            color: "danger",
          });
        }
      } else {
        addToast({
          title: "Failed to update email",
          color: "danger",
        });
      }
    } finally {
      setIsLoading(false);
    }
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

      // Delete the user account
      // await deleteCurrentUser();
      setUser(null);

      // Clear the imagify.user.id cookie
      Cookies.remove("imagify.user.id");

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
            <Card className="max-w-md">
              <CardBody>
                <h3 className="text-lg font-medium dark:text-white mb-4">
                  Account Information
                </h3>
                <form onSubmit={handleSubmit(onSubmitEmail)} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <CustomInput
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      color="primary"
                      variant="solid"
                      isDisabled={!isValid}
                    >
                      Update Email
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
            <div className="flex flex-row gap-4 items-center mt-4">
              <Button color="danger" variant="bordered" onPress={onOpen}>
                Delete Account
              </Button>
            </div>
          </div>
        </Tab>
        <Tab key="preferences" title="Preferences">
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
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
