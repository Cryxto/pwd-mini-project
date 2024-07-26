import { SignInSchema, SignUpSchema } from "@/validations/auth.validation";
import { InferType } from "yup";

export type SignUpType = InferType<typeof SignUpSchema>;
export type SignInType = InferType<typeof SignInSchema>;