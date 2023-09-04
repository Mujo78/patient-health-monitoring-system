import * as Yup from "yup"

export const changePasswordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required!"),
    newPassword: Yup.string().required("New password is required!").min(6, 'Password is too short!'),
    confirmNewPassword: Yup.string().required('Confirm of new password is required').min(5, "Confirm password is too short!").test('password-match', "Passwords must match", function (value) {
        return value === this.parent.newPassword
    })
})