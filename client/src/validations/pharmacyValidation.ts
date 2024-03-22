import * as Yup from "yup";

export type PharmacyType = {
  name: string;
  address: string;
  description: string;
  phone_number: string;
  from: string;
  to: string;
};

export interface PharmacyUpdateType {
  name: string;
  address: string;
  description: string;
  phone_number: string;
  working_hours: string;
  from?: string;
  to?: string;
}

export const pharmacyValidationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  phone_number: Yup.string()
    .required("Phone number is required!")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers!")
    .max(12, "Length error! (max 12)"),
  address: Yup.string().required("Address is required!"),
  description: Yup.string().required("Description is required!"),
  from: Yup.string()
    .required("Working hours are required!")
    .matches(/^[0-9]+$/, "Working hours must contain only numbers!"),
  to: Yup.string()
    .required("Working hours are required!")
    .matches(/^[0-9]+$/, "Working hours must contain only numbers!"),
});
