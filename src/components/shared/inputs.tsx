"use client";

import { Button, IconButtonWrapper } from "@/components/shared/buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea as UITextarea } from "@/components/ui/textarea";
import { Muted, P } from "@/components/ui/typography";
import { cn, fileToBase64 } from "@/utils/common";
import { formatFileSize } from "@/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ImageIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export const PasswordInput = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id="password"
          value={value}
          onChange={onChange}
          type={isPasswordVisible ? "text" : "password"}
          className="pr-10 transition-all duration-300 ease-in-out"
        />
        <IconButtonWrapper
          className="absolute top-0 right-0 h-full px-3 z-10 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          {isPasswordVisible ? (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Eye className="w-4 h-4 text-muted-foreground" />
          )}
        </IconButtonWrapper>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ImageInput = ({
  onChange,
  label,
  value,
  error,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value?: File;
  error?: string | null;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="image">{label}</Label>
      <motion.div
        whileHover={{
          filter: "brightness(0.8)",
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <Input
          ref={inputRef}
          id="image"
          type="file"
          onChange={onChange}
          accept=".jpg,.jpeg,.png,.webp"
          className="cursor-pointer"
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileInput = ({
  onChange,
  label,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor="file">{label}</Label>
      <Input id="file" type="file" onChange={onChange} />
    </div>
  );
};

export const TextInput = ({
  value,
  onChange,
  label,
  error,
  placeholder,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <Label
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          )}
          htmlFor="text"
        >
          {label}
        </Label>
      )}
      <Input
        id="text"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "transition-all duration-300 ease-in-out"
        )}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const EmailInput = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        className="transition-all duration-300 ease-in-out"
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TextActionInput = ({
  value,
  onChange,
  label,
  actionButton,
  error,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  actionButton: {
    text: string;
    onPress: () => void;
    disabled?: boolean;
    isLoading?: boolean;
  };
  error?: string | null;
}) => {
  return (
    <div className="w-full space-y-2">
      <Label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
        htmlFor="action"
      >
        {label}
      </Label>
      <div className="relative flex items-center gap-2">
        <Input
          id="action"
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-all duration-300 ease-in-out"
          )}
        />
        <Button
          type="button"
          onClick={actionButton.onPress}
          disabled={actionButton.disabled || actionButton.isLoading}
          className="flex items-center gap-2"
        >
          {actionButton.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            actionButton.text
          )}
        </Button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Textarea = ({
  value,
  onChange,
  label,
  error,
  placeholder,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  error?: string;
  placeholder?: string;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="message">{label}</Label>
      <UITextarea
        id="message"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SelectSingle = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) => {
  return (
    <div className="w-full space-y-2">
      <Label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        )}
        htmlFor="select"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <motion.div
          whileHover={{
            filter: "brightness(0.8)",
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </motion.div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SelectContent position="popper">
              {options.map((option) => (
                <motion.div
                  key={option}
                  whileHover={{
                    filter: "brightness(0.8)",
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="cursor-pointer"
                >
                  <SelectItem value={option} className="cursor-pointer">
                    {option}
                  </SelectItem>
                </motion.div>
              ))}
            </SelectContent>
          </motion.div>
        </AnimatePresence>
      </Select>
    </div>
  );
};

export const NumberInput = ({
  value,
  onChange,
  label,
  error,
  min,
  max,
  step,
  placeholder,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor="number">{label}</Label>
      <Input
        id="number"
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="transition-all duration-300 ease-in-out"
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DragDropImageInput = ({
  onUpload,
  onError,
  label,
  error,
}: {
  onUpload: (
    base64: string,
    fileSize?: string,
    fileName?: string,
    format?: string,
    file?: File
  ) => void;
  onError?: (error: string) => void;
  label?: string;
  error?: string | null;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file size (10MB limit)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        onError?.("File size must be less than 10MB");
        return;
      }

      // Check if file is a supported image type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        onError?.("Please select a JPG, PNG, or WebP image file");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const fileSize = formatFileSize(file.size);
        const fileName = file.name
          .replace(".webp", "")
          .replace(".jpg", "")
          .replace(".jpeg", "")
          .replace(".png", "")
          .slice(0, 20)
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();
        const format = file.type.replace("image/", "");
        onUpload(base64, fileSize, fileName, format, file);
      } catch (error) {
        onError?.(
          "Failed to process the dropped file. Please try another file."
        );
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && <Label>{label}</Label>}
      <motion.div
        className={cn(
          "h-[100px] border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center p-6 transition-colors",
          isDragOver
            ? "border-ring bg-accent"
            : "border-border hover:border-input"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragOver ? 1.02 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.1 },
        }}
      >
        <div className="text-muted-foreground">
          <ImageIcon className="mx-auto h-8 w-8" />
          <P className="text-sm font-medium">Drop image here</P>
        </div>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Muted className="text-red-500">{error}</Muted>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
