import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import {
  authUser,
  login,
  reset as resetAuth,
} from "../../features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "../../validations/auth/loginValidation";
import {
  HiEnvelope,
  HiLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

import ForgotPasswordModal from "../../components/Profile/ForgotPasswordModal";
import CustomButton from "../../components/UI/CustomButton";
import Logo from "../../components/UI/Logo";
import Input from "../../components/UI/Input";
import Header from "../../components/UI/Header";

type User = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, reset } = useForm<User>({
    resolver: yupResolver(loginValidationSchema),
  });
  const { errors } = formState;

  const dispatch = useAppDispatch();
  const { accessUser, status, message } = useSelector(authUser);

  const route = accessUser?.data.role.toLowerCase();

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  useEffect(() => {
    if (accessUser !== null && status === "idle") {
      navigate(`/${route}/${accessUser.data._id}`);
    } else {
      navigate("/");
    }
  }, [accessUser, dispatch, status, route, navigate]);

  const onSubmit = (data: User) => {
    dispatch(login(data));
  };

  const forgotPasswordShow = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setForgotPassword(true);
  };

  useEffect(() => {
    if (status === "idle") {
      reset();
    }
  }, [status, reset]);

  const togglePassword = () => {
    setShowPassword((n) => !n);
  };

  return (
    <div className="flex h-fit w-full flex-col items-center lg:!h-screen">
      <div className="flex items-start justify-center lg:!mr-auto">
        <Logo />
      </div>
      <div className="my-auto">
        {forgotPassword && (
          <ForgotPasswordModal
            forgotPassword={forgotPassword}
            setForgotPassword={setForgotPassword}
          />
        )}
        <div>
          <Header text="Log in to You Account" bold size={5} normal />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-5 flex max-w-sm flex-col gap-1 xxl:!max-w-md"
          >
            <Input
              autoComplete="true"
              label="Email"
              {...register("email")}
              id="email"
              disabled={status === "loading"}
              icon={HiEnvelope}
              color={errors.email && "failure"}
              placeholder="name@example.com"
              type="email"
              error={errors.email}
            />

            <div className="relative">
              <Input
                label="Password"
                {...register("password")}
                color={errors.password && "failure"}
                id="password"
                disabled={status === "loading"}
                icon={HiLockClosed}
                type={showPassword ? "text" : "password"}
              >
                <div className="xxl:!text-md text-xs">
                  {errors.password ? (
                    <p className="text-red-600">{errors.password.message}</p>
                  ) : message ? (
                    <p className="text-red-600"> {message} </p>
                  ) : (
                    ""
                  )}
                </div>
              </Input>
              <div
                className="bottom-50 absolute right-2 top-12 -translate-y-1/2 transform cursor-pointer xxl:!top-14"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="xxl:!size-6" />
                ) : (
                  <HiOutlineEye className="xxl:!size-6" />
                )}
              </div>
            </div>
            <button
              type="button"
              className="xxl:!text-md mb-2 ml-auto cursor-pointer !bg-white p-0 text-xs text-black underline"
              disabled={status === "loading"}
              onClick={(event) => forgotPasswordShow(event)}
            >
              Forgot password?
            </button>

            <CustomButton disabled={status === "loading"} type="submit">
              <p className="xxl:!text-lg">Log in</p>
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
