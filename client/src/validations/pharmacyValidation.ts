import * as Yup from "yup";

export const categories = [
  "Pain Relief",
  "Antibiotics",
  "Antipyretics",
  "Antacids",
  "Antihistamines",
  "Antidepressants",
  "Anticoagulants",
  "Antidiabetics",
  "Antipsychotics",
  "Vaccines",
  "Other",
];

export const pharmacyValidationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  phone_number: Yup.string()
    .required("Phone number is required!")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers!")
    .max(12, "Length error! (max 12)"),
  address: Yup.string().required("Address is required!"),
  description: Yup.string().required("Description is required!"),
  from: Yup.string()
    .required("Starting hour is required!")
    .matches(/^[0-9]+$/, "Working hours must contain only numbers!")
    .matches(/^(?:[1-9]|1[0-2])$/, "Number must be between 1 and 12!"),
  to: Yup.string()
    .required("Ending hour is required!")
    .matches(/^[0-9]+$/, "Working hours must contain only numbers!")
    .matches(/^(?:[1-9]|1[0-2])$/, "Number must be between 1 and 12!"),
});
