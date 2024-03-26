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
import ErrorMessage from "../../components/UI/ErrorMessage";

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
    <div className="flex flex-col items-center h-screen gap-5 w-full">
      <div
        className="mx-auto lg:!mx-0 lg:!mr-auto cursor-pointer"
        onClick={goToLoginPage}
      >
        <Logo />
      </div>
      <div className="w-full lg:!w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl xxl:!text-4xl font-bold text-center">
          Reset Password
        </h1>
        <Tabs.Group className="px-2">
          <Tabs.Item active title="Password reset">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3 px-4 md:!px-12 lg:!px-20"
            >
              <p className="text-sm xxl:!text-2xl">
                Set the new password for your account so you can login and
                access all the features!
              </p>
              <div>
                <Label
                  htmlFor="password"
                  value="Password"
                  className="xxl:!text-lg"
                />
                <TextInput
                  {...register("password")}
                  id="password"
                  disabled={status === "loading"}
                  color={errors.password && "failure"}
                  icon={HiLockClosed}
                  type="password"
                />
                <ErrorMessage text={errors.password?.message} />
              </div>
              <div>
                <Label
                  htmlFor="passwordConfirm"
                  value="Confirm Password"
                  className="xxl:!text-lg"
                />
                <TextInput
                  {...register("passwordConfirm")}
                  id="passwordConfirm"
                  disabled={status === "loading"}
                  color={errors.passwordConfirm && "failure"}
                  icon={HiLockClosed}
                  type="password"
                />
                <ErrorMessage text={errors.passwordConfirm?.message} />
              </div>
              <CustomButton
                disabled={status === "loading"}
                type="submit"
                className="md:!w-fit md:!ml-auto lg:!ml-0 lg:!mx-auto"
              >
                <p className="xxl:!text-xl">Reset Password</p>
              </CustomButton>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default ForgotPassword;
