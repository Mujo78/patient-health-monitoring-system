import * as Yup from "yup";
import { genders } from "./personValidation";

export const doctorValidationSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required!")
    .min(3, "First name is too short!"),
  last_name: Yup.string()
    .required("Last name is required!")
    .min(3, "Last name is too short!"),
  phone_number: Yup.string()
    .required("Phone number is required!")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers!")
    .max(12, "Length error! (max 12)"),
  speciality: Yup.string().required("Speciality is required!"),
  qualification: Yup.string().required("Qualification is required!"),
  gender: Yup.string()
    .required("Gender is required!")
    .oneOf(genders, "Invalid gender!"),
  address: Yup.string().required("Address is required!"),
  bio: Yup.string().required("Bio is required!").min(10, "Bio is too short!"),
  age: Yup.string()
    .required("Age is required!")
    .matches(/^[0-9]+$/, "Age must contain only numbers!")
    .test("age-restrict", "Age (min 25, max 75)", (n) => {
      if (Number(n) > 75 || Number(n) < 25) return false;
      return true;
    }),
  available_days: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Value is required"),
        label: Yup.string().required("Label is required!"),
      }),
    )
    .required("Available days are required!")
    .min(3, "You have to choose at least 3 days!")
    .max(5, "You can choose only 5 days in week!"),
});
