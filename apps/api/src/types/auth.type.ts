import { AuthSchema } from "@/validations/auth.validation";
import { InferType } from "yup";

export type UserType = InferType<typeof AuthSchema>;