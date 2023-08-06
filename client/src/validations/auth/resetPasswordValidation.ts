import * as Yup from "yup"

export const resetPasswordValidationSchema = Yup.object({
    password: Yup.string().required("Password is required!").min(5, "Password is too short!"),
    passwordConfirm: Yup.string().required("Confirm password is required!").min(5, "Confirm password is too short!").test('password-match', "Passwords must match", function (value) {
        return value === this.parent.password
    })
})