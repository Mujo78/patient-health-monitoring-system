import React, { useEffect, useState } from "react";
import { Label, TextInput } from "flowbite-react";
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

import ForgotPasswordModal from "../../components/ForgotPasswordModal";
import CustomButton from "../../components/UI/CustomButton";
import Logo from "../../components/UI/Logo";

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
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
    <div className="h-3/4 flex justify-between flex-col">
      <div className="flex items-start justify-start">
        <Logo />
      </div>
      <div>
        {forgotPassword && (
          <ForgotPasswordModal
            forgotPassword={forgotPassword}
            setForgotPassword={setForgotPassword}
          />
        )}
        <>
          <h1 className="text-5xl font-Poppins flex justify-center mb-12 font-bold">
            Log in to Your Account
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex mx-auto font-Poppins max-w-sm flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                {...register("email")}
                id="email"
                disabled={status === "loading"}
                icon={HiEnvelope}
                color={errors.email && "failure"}
                placeholder="name@example.com"
                type="email"
              />
              <div className="h-3 mt-1">
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <div className="relative">
                <TextInput
                  {...register("password")}
                  color={errors.password && "failure"}
                  id="password"
                  disabled={status === "loading"}
                  icon={HiLockClosed}
                  type={showPassword ? "text" : "password"}
                />
                <div
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </div>
              </div>
              <div className="h-4 flex justify-between mt-1">
                {errors.password ? (
                  <p className="text-red-600 text-xs">
                    {" "}
                    {errors.password.message}{" "}
                  </p>
                ) : message ? (
                  <p className="text-red-600 text-xs"> {message} </p>
                ) : (
                  ""
                )}
                <button
                  className="text-xs ml-auto underline p-0 mt-1 mb-4 !bg-white text-black cursor-pointer"
                  disabled={status === "loading"}
                  onClick={(
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => forgotPasswordShow(event)}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <CustomButton
              disabled={status === "loading"}
              className="bg-blue-700 hover:!bg-blue-600  transition-colors duration-300"
              type="submit"
            >
              Log in
            </CustomButton>
          </form>
        </>
      </div>
    </div>
  );
};

export default LoginForm;
