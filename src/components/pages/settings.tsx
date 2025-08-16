"use client";

import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import { Button } from "@/components/shared/buttons";
import {
  PasswordInput,
  EmailInput,
  TextInput,
} from "@/components/shared/inputs";
import { TabLink } from "@/components/shared/links";
import { WithLoader, WithLoaderNode } from "@/components/shared/loaders";
import PageTransition from "@/components/shared/transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H1 } from "@/components/ui/typography";
import { useUser } from "@/context/user/provider";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isStrongPassword } from "validator";
import { z } from "zod";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().refine(isStrongPassword, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const ChangeEmailSchema = z.object({
  updatedEmail: z.email("Please enter a valid email address"),
});

type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
type ChangeEmailFormValues = z.infer<typeof ChangeEmailSchema>;

function ChangePasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: changePassword, isPending: isChangePending } =
    trpc.settings.changePassword.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          setSuccessMessage(data.message || "Password changed successfully!");
          setErrorMessage(null);
          form.reset();
        } else {
          setErrorMessage(
            data.message || "Failed to change password. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to change password. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const setFormValue = (
    field: keyof ChangePasswordFormValues,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const currentPassword = values.currentPassword;
  const newPassword = values.newPassword;
  const confirmNewPassword = values.confirmNewPassword;
  const errors = form.formState.errors;
  const currentPasswordError = errors.currentPassword?.message;
  const newPasswordError = errors.newPassword?.message;
  const confirmNewPasswordError = errors.confirmNewPassword?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setFormValue("currentPassword", e.target.value)}
            error={currentPasswordError}
          />
          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setFormValue("newPassword", e.target.value)}
            error={newPasswordError}
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setFormValue("confirmNewPassword", e.target.value)}
            error={confirmNewPasswordError}
          />
          <Button
            type="submit"
            variant="default"
            className="mt-2 w-full"
            disabled={!isFormValid || isChangePending}
          >
            {WithLoader({
              text: "Change Password",
              isLoading: isChangePending,
            })}
          </Button>
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </form>
      </CardContent>
    </Card>
  );
}

function ChangeEmailForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { logout, userProfile } = useUser();

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(ChangeEmailSchema),
    mode: "onChange",
    defaultValues: {
      updatedEmail: "",
    },
    values: {
      updatedEmail: userProfile?.email || "",
    },
  });

  const { mutate: changeEmail, isPending: isChangePending } =
    trpc.settings.changeEmail.useMutation({
      onSuccess: (data) => {
        if (data.success) {
          setSuccessMessage(data.message || "Email changed successfully!");
          setErrorMessage(null);
          form.reset();
          logout();
        } else {
          setErrorMessage(
            data.message || "Failed to change email. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to change email. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: ChangeEmailFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    changeEmail({
      updatedEmail: data.updatedEmail,
    });
  };

  const setFormValue = (field: keyof ChangeEmailFormValues, value: string) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const updatedEmail = values.updatedEmail;
  const errors = form.formState.errors;
  const updatedEmailError = errors.updatedEmail?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>Update your account email address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {WithLoaderNode({
            isLoading: !userProfile,
            content: (
              <EmailInput
                value={updatedEmail}
                onChange={(e) => setFormValue("updatedEmail", e.target.value)}
                error={updatedEmailError}
              />
            ),
          })}
          <Button
            type="submit"
            variant="default"
            className="mt-2 w-full"
            disabled={!isFormValid || isChangePending || !userProfile}
          >
            {WithLoader({
              text: "Change Email",
              isLoading: isChangePending,
            })}
          </Button>
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </form>
      </CardContent>
    </Card>
  );
}

const DeleteAccountSchema = z.object({
  confirmationText: z.string().refine((val) => val === "delete my account", {
    message: "Please type 'delete my account' to confirm",
  }),
});

type DeleteAccountFormValues = z.infer<typeof DeleteAccountSchema>;

function DeleteAccount() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(DeleteAccountSchema),
    mode: "onChange",
    defaultValues: {
      confirmationText: "",
    },
  });

  const { mutate: deleteAccount, isPending: isDeletePending } =
    trpc.settings.deleteAccount.useMutation({
      onSuccess: (ok) => {
        if (ok) {
          setSuccessMessage("Account deleted successfully");
          setErrorMessage(null);
        } else {
          setErrorMessage("Failed to delete account. Please try again.");
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to delete account. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: DeleteAccountFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    deleteAccount();
  };

  const setFormValue = (
    field: keyof DeleteAccountFormValues,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const confirmationText = values.confirmationText;
  const errors = form.formState.errors;
  const confirmationTextError = errors.confirmationText?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="w-full border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <TextInput
            label={`Type "delete my account" to confirm`}
            value={confirmationText}
            onChange={(e) => setFormValue("confirmationText", e.target.value)}
            error={confirmationTextError}
          />
          <Button
            type="submit"
            variant="destructive"
            className="mt-2 w-full"
            disabled={!isFormValid || isDeletePending}
          >
            {WithLoader({
              text: "Delete Account",
              isLoading: isDeletePending,
            })}
          </Button>
          {successMessage && <SuccessAlert message={successMessage} />}
          {errorMessage && <ErrorAlert message={errorMessage} />}
        </form>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <PageTransition className="">
      <div className="w-full">
        <div className="mb-6 flex justify-start">
          <H1>Settings</H1>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">
              <TabLink>Account</TabLink>
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <TabLink>Preferences</TabLink>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="w-full">
            <div className="flex flex-row gap-6 mt-4">
              <div className="w-full flex flex-col gap-4">
                <ChangeEmailForm />
                <div className="w-full">
                  <DeleteAccount />
                </div>
              </div>
              <div className="w-full">
                <ChangePasswordForm />
              </div>
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
      </div>
    </PageTransition>
  );
}
