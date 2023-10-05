import * as Yup from "yup"

export type patient = {
        blood_type: string,
        date_of_birth: Date,
        first_name: string,
        phone_number: string,
        gender: string,
        height: string | "",
        last_name: string,
        weight:string | "",
        address: string,
}

export const personValidationSchema = Yup.object({
    first_name: Yup.string().required("First name is required!").min(2, "First name is too short!"),
    last_name: Yup.string().required("Last name is required!").min(2,"Last name is too short!"),
    phone_number: Yup.string().matches(/^[0-9]+$/, "Phone number must contain only numbers!").max(12, "Length error! (max 12)").required("Phone number is required!"),
    address: Yup.string().required("Address is required!"),
    gender: Yup.string().required("Gender is required!"),
    blood_type: Yup.string().required("Blood type is required!"),
    date_of_birth: Yup.date().typeError("Invalid date!").required("Date of birth is required!"),
    weight: Yup.string().default(""),
    height: Yup.string().default(""),
})

export type patientGeneralSettings = {
    email: string,
    notification: boolean | true
}

export const generalPatientSettings = Yup.object({
    email: Yup.string().required("Email is required!").email("Please provide a valid eamil address!").test('email-valid', 'Email is not valid, use valid email to create an account.', (value) => {
        if(value.includes("@hs.com")){
            return false
        }
        return true
    }),
    notification: Yup.boolean().required("Notification field is required!")
})