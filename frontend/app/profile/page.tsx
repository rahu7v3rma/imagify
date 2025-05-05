"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useUser } from "../../context/user";
import { useApi } from "../../utils/api";
import { ProfileSchema } from "../../utils/formsSchema";

export default function ProfilePage() {
  const { user, logout, fetchProfile } = useUser();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(ProfileSchema),
  });

  const updateProfileApi = useApi({
    url: "/user/profile",
    method: "POST",
  });

  const onSubmit = (data: z.infer<typeof ProfileSchema>) => {
    updateProfileApi({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res.success) {
        fetchProfile();
      }
    });
    setValue("password", "");
    setValue("confirmPassword", "");
  };

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="heading-1">Profile</h1>
      <div className="flex flex-row gap-2">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Name"
              type="text"
              className="w-[300px]"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Email"
              type="text"
              className="w-[300px]"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              type="password"
              className="w-[300px]"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Confirm Password"
              type="password"
              className="w-[300px]"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
      </div>
      <Button onClick={handleSubmit(onSubmit)}>Update</Button>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
