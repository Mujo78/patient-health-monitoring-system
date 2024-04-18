import * as Yup from "yup";
import { getEighteenYearsAgoDate } from "../service/authSideFunctions";

export const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const genders = ["Male", "Female", "Other"];

export const personValidationSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required!")
    .min(2, "First name is too short!"),
  last_name: Yup.string()
    .required("Last name is required!")
    .min(2, "Last name is too short!"),
  phone_number: Yup.string()
    .required("Phone number is required!")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers!")
    .max(12, "Length error! (max 12)"),
  address: Yup.string().required("Address is required!"),
  gender: Yup.string()
    .required("Gender is required!")
    .oneOf(genders, "Invalid gender!"),
  blood_type: Yup.string()
    .required("Blood type is required!")
    .oneOf(bloodTypes, "Invalid blood type!"),
  date_of_birth: Yup.date()
    .typeError("Invalid date!")
    .required("Date of birth is required!")
    .max(getEighteenYearsAgoDate(), "Invalid date"),
  weight: Yup.string().default(""),
  height: Yup.string().default(""),
});

export const generalPatientSettings = Yup.object({
  email: Yup.string()
    .required("Email is required!")
    .email("Please provide a valid eamil address!")
    .test(
      "email-valid",
      "Email is not valid, use valid email to create an account.",
      (value) => {
        if (value.includes("@hs.com")) {
          return false;
        }
        return true;
      },
    ),
  notification: Yup.boolean().required("Notification field is required!"),
});
