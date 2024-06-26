import { apiClient, apiClientAuth } from "../../helpers/ApiClient";
import {
  LoginUser,
  PatientUser,
  ResetPassword,
  UpdateUserInterface,
  changePasswordInterface,
} from "./authSlice";

const URL = "/user";

const login = async (loginData: LoginUser) => {
  const response = await apiClient.post(`${URL}/login`, loginData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const signup = async (signupData: PatientUser) => {
  const form = new FormData();
  form.append("first_name", signupData.first_name);
  form.append("last_name", signupData.last_name);
  form.append("phone_number", signupData.phone_number);
  form.append("address", signupData.address);
  form.append("gender", signupData.gender);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  form.append("photo", signupData.photo ? signupData.photo[0] : "");
  form.append("blood_type", signupData.blood_type);
  form.append("date_of_birth", signupData.date_of_birth.toString());
  form.append("email", signupData.email);
  form.append("password", signupData.password);
  form.append("passwordConfirm", signupData.passwordConfirm);

  const response = await apiClient.post(`${URL}/signup`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const resetPassword = async (ResetPasswordData: ResetPassword) => {
  const response = await apiClient.patch(
    `${URL}/reset-password/${ResetPasswordData.token}`,
    ResetPasswordData,
  );

  return response.data;
};

const verifyEmail = async (verificationToken: string) => {
  const response = await apiClient.get(`${URL}/verify/${verificationToken}`);
  return response.data;
};

const updateUser = async (data: UpdateUserInterface) => {
  const response = await apiClientAuth.patch(`${URL}/update-me`, data);
  return response.data;
};

const deactivateMyAccount = async (data: { active: boolean }) => {
  const response = await apiClientAuth.patch(`${URL}/deactivate`, data);
  return response.data;
};

export async function updatePhoto(photo: File) {
  const form = new FormData();
  form.append("photo", photo);

  const response = await apiClientAuth.patch(`${URL}/update-photo`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

const firstTimeUsing = async () => {
  const response = await apiClientAuth.patch(`${URL}/`, {});
  return response.data;
};

const changeMyPassword = async (
  changePasswordData: changePasswordInterface,
) => {
  const response = await apiClientAuth.patch(
    `${URL}/change-password`,
    changePasswordData,
  );

  return response.data;
};

const authServices = {
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
  firstTimeUsing,
  updatePhoto,
  updateUser,
  deactivateMyAccount,
  changeMyPassword,
};

export default authServices;
