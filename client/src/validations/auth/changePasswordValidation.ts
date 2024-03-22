import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required!"),
  newPassword: Yup.string()
    .required("New password is required!")
    .min(6, "Password is too short!")
    .test(
      "password-match-new",
      "Old and new password are the same!",
      function (value) {
        return value !== this.parent.currentPassword;
      }
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm password is required")
    .min(5, "Confirm password is too short!")
    .test("password-match-confirm", "Passwords must match", function (value) {
      return value === this.parent.newPassword;
    }),
});
