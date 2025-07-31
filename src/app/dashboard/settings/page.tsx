"use client";

import ConfirmationModal from "@/components/confirmation-modal";
import { EmailInput, PasswordInput } from "@/components/input";
import ThemeToggle from "@/components/theme-toggle";
import {
  Button,
  Card,
  CardBody,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { ChangeEvent, useState } from "react";

export default function SettingsPage() {
  const { isOpen, onOpen } = useDisclosure();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitEmail = () => {};

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
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <EmailInput
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={onSubmitEmail}
                    >
                      Update Email
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="max-w-md mt-6">
              <CardBody>
                <h3 className="text-lg font-medium dark:text-white mb-4">
                  Change Password
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <PasswordInput
                      label="Current Password"
                      value={currentPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCurrentPassword(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <PasswordInput
                      label="New Password"
                      value={newPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <PasswordInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => {}}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
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
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>

      <ConfirmationModal
        isOpen={isOpen}
        title="Confirm Account Deletion"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed."
      />
    </div>
  );
}
