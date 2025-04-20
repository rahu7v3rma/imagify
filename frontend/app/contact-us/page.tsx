"use client";
import { Button, Input, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required"),
  attachment: z.instanceof(File),
});

export default function ContactUsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const registerApi = useApi({
    url: "/user/register",
    method: "POST",
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    registerApi(data);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <Input
          label="Email"
          type="text"
          className="w-[300px]"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Textarea
          label="Message"
          className="w-[300px]"
          {...register("message")}
          isInvalid={!!errors.message}
          errorMessage={errors.message?.message}
        />
        <Input
          label="Attachment"
          type="file"
          className="w-[300px]"
          {...register("attachment")}
          isInvalid={!!errors.attachment}
          errorMessage={errors.attachment?.message}
        />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
}
