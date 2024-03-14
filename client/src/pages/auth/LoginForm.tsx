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

import ForgotPasswordModal from "../../components/ForgotPasswordModal";
import CustomButton from "../../components/UI/CustomButton";
import Logo from "../../components/UI/Logo";
import Input from "../../components/UI/Input";

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
    <div className="h-fit lg:!h-screen flex items-center w-full flex-col">
      <div className="flex items-start justify-center lg:!mr-auto lg:!justify-start">
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
          <h1 className="text-3xl text-center lg:!text-5xl mb-5 flex justify-center font-bold">
            Log in to Your Account
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex mx-auto max-w-sm xxl:!max-w-md flex-col gap-1"
          >
            <Input
              value="Email"
              {...register("email")}
              id="email"
              disabled={status === "loading"}
              icon={HiEnvelope}
              color={errors.email && "failure"}
              placeholder="name@example.com"
              type="email"
              error={errors.email}
            />
            <>
              <div className="relative mb-5">
                <Input
                  value="Password"
                  {...register("password")}
                  color={errors.password && "failure"}
                  id="password"
                  disabled={status === "loading"}
                  icon={HiLockClosed}
                  type={showPassword ? "text" : "password"}
                >
                  <div className="flex justify-between text-xs xxl:!text-md">
                    {errors.password ? (
                      <p className="text-red-600">{errors.password.message}</p>
                    ) : message ? (
                      <p className="text-red-600"> {message} </p>
                    ) : (
                      ""
                    )}
                    <button
                      className="text-xs xxl:!text-md ml-auto underline p-0 mt-1 mb-4 !bg-white text-black cursor-pointer"
                      disabled={status === "loading"}
                      onClick={(event) => forgotPasswordShow(event)}
                    >
                      Forgot password?
                    </button>
                  </div>
                </Input>
                <div
                  className="absolute right-2 bottom-50 top-12 xxl:!top-14 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </div>
              </div>
            </>
            <CustomButton
              disabled={status === "loading"}
              className="bg-blue-700 hover:!bg-blue-600  transition-colors duration-300"
              type="submit"
            >
              <p className="xxl:!text-xl">Log in</p>
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
