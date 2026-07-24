import { z } from "zod";

// Auth Schemas
const SignupSchema = z.object({
    name: z.string().min(3, { message: "Name must have three characters" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(8, { message: "Password must have 8 characters" })
})

type TSignup = z.infer<typeof SignupSchema>;

const SigninSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(8)
})

type TSignin = z.infer<typeof SigninSchema>;


export {
    SignupSchema,
    SigninSchema,

}

export type {
     TSignup,
     TSignin,

}