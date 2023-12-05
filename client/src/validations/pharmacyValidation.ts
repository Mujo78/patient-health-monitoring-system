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
  name: Yup.string().required("First name is required!"),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only numbers!")
    .max(12, "Length error! (max 12)")
    .required("Phone number is required!"),
  address: Yup.string().required("Address is required!"),
  description: Yup.string().required("Description is required!"),
  from: Yup.string().required("Working hours are required!"),
  to: Yup.string().required("Working hours are required!"),
});
