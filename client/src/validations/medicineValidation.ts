import * as Yup from "yup";

export const medicineValidationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  strength: Yup.string().required("Strength is required!"),
  category: Yup.string().required("Category is required!"),
  description: Yup.string().required("Description is required!"),
  price: Yup.string().required("Price is required!"),
  photo: Yup.mixed().test("test-name", "Photo is required!", (value) => {
    if (typeof value === "string" || value instanceof File || value !== "") {
      return true;
    }
    return false;
  }),
  manufacturer: Yup.string().required("Manufacturer is required!"),
  available: Yup.boolean().required("Availability is required!"),
});
