import { z } from "zod"

// ============================================================
// user
// ============================================================

export const email = z
  .string({ required_error: "ایمیل نیاز است" })
  .trim()
  .email({ message: "ایمیل معتبر نیست" })
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string({ required_error: "پسورد نیاز است" })
  .trim()
  .min(4, { message: "پسورد باید حداقل دارای 4 کاراکتر باشد" })
  .max(100, { message: "پسورد باید دارای حداکثر ۱۰۰ کاراکتر باشد" })
  .transform((str) => str.trim())

export const Signup: any = z
  .object({
    // name: z
    // 	.string({ required_error: "نام نیاز است" })
    // 	.min(2, { message: "نام باید حداقل دارای ۲ کاراکتر باشد" }),
    username: z
      .string({ required_error: "نام کاربری نیاز است" })
      .min(2, { message: "نام باید حداقل دارای ۲ کاراکتر باشد" }),
    email: email,
    password: password,
    passwordConfirmation: password,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "پسورد ها همخوانی ندارند",
    path: ["passwordConfirmation"],
  })

export const Login = z.object({
  email: email,
  password: password,
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "پسورد ها همخوانی ندارند",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})

// ============================================================
// database
// ============================================================
export const SimpleQuery = z.object({
  query: z
    .string({ message: "کوئری الزامی است" })
    .min(2, { message: "کوئری باید حداقل دارای ۲ کاراکتر باشد" }),
})
export const ComplexQuery = z.object({
  Title: z.string({ message: "عنوان الزامی است" }),
  Abstract: z.string({ message: "چکیده الزامی است" }),
  Keywords: z.string({ message: "کلمه کلیدی الزامی است" }),
})
export const CreateDatabaseSimple = z.object({
  // name: z
  //   .string({ message: "نام پایگاه داده الزامی است" })
  //   .min(2, { message: "نام باید حداقل دارای ۲ کاراکتر باشد" })
  //   .trim(),
  query: z
    .string({ message: "کوئری الزامی است" })
    .min(2, { message: "کوئری باید حداقل دارای ۲ کاراکتر باشد" })
    .trim(),
})

export const CreateDatabaseComplex = z.object({
  // name: z
  //   .string({ message: "نام پایگاه داده الزامی است" })
  //   .trim()
  //   .min(2, { message: "نام باید حداقل دارای ۲ کاراکتر باشد" }),
  // Title: z.string({ message: "عنوان باید رشته باشد" }).trim(),
  // Abstract: z.string({ message: "چکیده باید رشته باشد" }).trim(),
  // Keywords: z.string({ message: "کلمه کلیدی باید رشته" }).trim(),
})
