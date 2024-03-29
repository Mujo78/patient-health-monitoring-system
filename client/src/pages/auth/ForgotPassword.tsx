import { Tabs } from "flowbite-react";
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
import Header from "../../components/UI/Header";
import Input from "../../components/UI/Input";

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
    <div className="flex h-screen w-full flex-col items-center gap-5">
      <div
        className="mx-auto cursor-pointer lg:!mx-0 lg:!mr-auto"
        onClick={goToLoginPage}
      >
        <Logo />
      </div>
      <div className="flex w-full flex-col gap-4 lg:!w-1/2">
        <Header bold size={2} text="Reset Password" />
        <Tabs.Group className="px-2">
          <Tabs.Item active title="Password reset">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-0.5 px-4 md:!px-12 lg:!px-20"
            >
              <p className="text-sm xxl:!text-2xl">
                Set the new password for your account so you can login and
                access all the features!
              </p>
              <Input
                label="Password"
                id="password"
                disabled={status === "loading"}
                color={errors.password && "failure"}
                {...register("password")}
                icon={HiLockClosed}
                type="password"
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                id="passwordConfirm"
                disabled={status === "loading"}
                color={errors.passwordConfirm && "failure"}
                {...register("passwordConfirm")}
                icon={HiLockClosed}
                type="password"
                error={errors.passwordConfirm}
              />
              <CustomButton
                disabled={status === "loading"}
                type="submit"
                className="mt-2 md:!ml-auto md:!w-fit"
              >
                <p className="xxl:!text-lg">Reset Password</p>
              </CustomButton>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default ForgotPassword;
