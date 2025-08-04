import { ContactSchema } from "@/schemas/public/contact";
import { z } from "zod";

export type ContactFormData = z.infer<typeof ContactSchema>;
