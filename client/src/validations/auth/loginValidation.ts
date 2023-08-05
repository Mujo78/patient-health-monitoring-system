import * as Yup from "yup"

export const loginValidationSchema = Yup.object({
    email: Yup.string().email("Please provide a valid eamil address!").required("Email is required!"),
    password: Yup.string().required("Password is required!")
})