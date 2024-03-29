import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required!")
    .email("Please provide a valid eamil address!"),
  password: Yup.string().required("Password is required!"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required!")
    .email("Please provide a valid eamil address!"),
});
