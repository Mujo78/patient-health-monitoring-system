import * as Yup from "yup"

export const signupValidationSchema = Yup.object({
    first_name: Yup.string().required("First name is required!").min(2, "First name is too short!"),
    last_name: Yup.string().required("Last name is required!").min(2,"Last name is too short!"),
    phone_number: Yup.string().required("Phone number is required!").matches(/^[0-9]+$/, "Phone number must contain only numbers!").max(12, "Length error! (max 12)"),
    address: Yup.string().required("Address is required!"),
    photo: Yup.mixed(),
    gender: Yup.string().required("Gender is required!"),
    blood_type: Yup.string().required("Blood type is required!"),
    date_of_birth: Yup.date().typeError("Invalid date!").required("Date of birth is required!"),
    email: Yup.string().email("Please provide a valid eamil address!").required("Email is required!").test('email-valid', 'Email is not valid, use valid email to create an account.', (value) => {
        if(value.includes("@hs.com")){
            return false
        }
        return true
    }),
    password: Yup.string().required("Password is required!").min(5, 'Password is too short!'),
    passwordConfirm: Yup.string().required("Confirm password is required!").min(5, "Confirm password is too short!").test('password-match', "Passwords must match", function (value) {
        return value === this.parent.password
    })
})