import * as Yup from "yup"

type optionsType = {
    value: string,
    label: string
}

export type doctorType = {
    first_name: string,
    last_name: string,
    phone_number: string,
    speciality: string,
    qualification: string,
    address: string,
    bio: string,
    age: string,
    available_days: optionsType[]
}

export const doctorValidationSchema = Yup.object({
    first_name: Yup.string().required("First name is required!"),
    last_name: Yup.string().required("Last name is required!"),
    phone_number: Yup.string().matches(/^[0-9]+$/, "Phone number must contain only numbers!").max(12, "Length error! (max 12)").required("Phone number is required!"),
    speciality: Yup.string().required("Speciality is required!"),
    qualification: Yup.string().required("Qualification is required!"),
    address: Yup.string().required("Address is required!"),
    bio: Yup.string().required("Bio is required!"),
    age: Yup.string().required("Age is required!"),
    available_days: Yup.array().of(Yup.object().shape({
        value: Yup.string().required("Value is required"),
        label: Yup.string().required('Label is required!')
    })).required('Available days are required!').min(3, 'You have to choose at least 3 days!').max(5, 'You can choose only 5 days in week!')
})