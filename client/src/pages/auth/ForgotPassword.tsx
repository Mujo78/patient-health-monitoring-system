import { Label, Tabs, TextInput } from "flowbite-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { authUser, resetPassword, reset } from "../../features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordValidationSchema } from "../../validations/auth/resetPasswordValidation";
import { HiLockClosed } from "react-icons/hi2";
import CustomButton from "../../components/UI/CustomButton";
import Logo from "../../components/UI/Logo";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";

type PasswordReset = {
  password: string;
  passwordConfirm: string;
};

const ForgotPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState, getValues } =
    useForm<PasswordReset>({
      resolver: yupResolver(resetPasswordValidationSchema),
    });
  const { errors } = formState;
  const dispatch = useAppDispatch();
  const { status } = useSelector(authUser);

  const goToLoginPage = () => {
    navigate("/");
  };

  const onSubmit = () => {
    const passwordsObject = {
      token: token ? token : "",
      password: getValues().password,
      passwordConfirm: getValues().passwordConfirm,
    };
    reset();
    dispatch(resetPassword(passwordsObject));
    navigate("/api/v1/user/reset-password-result", { replace: true });
  };

  return (
    <div className="flex flex-col font-Poppins items-center h-screen w-full">
      <div className="mr-auto cursor-pointer" onClick={goToLoginPage}>
        <Logo />
      </div>
      <div className="w-1/3">
        <h1 className="text-4xl font-bold">Reset Password</h1>
        <Tabs.Group className="mt-4">
          <Tabs.Item active title="Password reset">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 px-20"
            >
              <p className="text-sm mb-4">
                Set the new password for your account so you can login and
                access all the features!
              </p>
              <div>
                <Label id="password" value="Password" />
                <TextInput
                  {...register("password")}
                  id="password"
                  disabled={status === "loading"}
                  color={errors.password && "failure"}
                  icon={HiLockClosed}
                  type="password"
                />
                <div className="h-3">
                  <p className="text-red-600 text-xs">
                    {errors.password?.message}
                  </p>
                </div>
              </div>
              <div>
                <Label id="passwordConfirm" value="Confirm Password" />
                <TextInput
                  {...register("passwordConfirm")}
                  id="passwordConfirm"
                  disabled={status === "loading"}
                  color={errors.passwordConfirm && "failure"}
                  icon={HiLockClosed}
                  type="password"
                />
                <div className="h-4">
                  <p className="text-red-600 text-xs">
                    {errors.passwordConfirm?.message}
                  </p>
                </div>
              </div>
              <CustomButton disabled={status === "loading"} type="submit">
                Reset Password
              </CustomButton>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default ForgotPassword;
