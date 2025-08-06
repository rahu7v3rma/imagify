"use client";

import ConfirmationModal from "@/components/modals";
import { EmailInput, PasswordInput } from "@/components/inputs";
import { MotionButton } from "@/components/buttons";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChangeEvent, useState } from "react";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitEmail = () => {};

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="py-4">
            <Card className="max-w-md">
              <CardContent>
                <h3 className="text-lg font-medium mb-4">
                  Account Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <MotionButton onClick={onSubmitEmail}>Update Email</MotionButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-md mt-6">
              <CardContent>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
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
                    <MotionButton onClick={() => {}}>Change Password</MotionButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-row gap-4 items-center mt-4">
              <MotionButton variant="destructive" onClick={() => setIsOpen(true)}>
                Delete Account
              </MotionButton>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-gray-600">
                    Switch between light and dark mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
