import React, { useEffect, useState } from "react";
import Header from "../components/UI/Header";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "../components/UI/CustomButton";
import { useForm } from "react-hook-form";
import {
  authUser,
  changePassword,
  changePasswordInterface,
  reset as resetStates,
} from "../features/auth/authSlice";
import { changePasswordValidationSchema } from "../validations/auth/changePasswordValidation";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import ErrorMessage from "../components/UI/ErrorMessage";
import { shallowEqual, useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { toast } from "react-hot-toast";
import Input from "../components/UI/Input";
import CustomSpinner from "../components/UI/CustomSpinner";
import { isFulfilled } from "@reduxjs/toolkit";

const Security: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { status, message } = useSelector(authUser, shallowEqual);

  const { register, handleSubmit, formState, reset } =
    useForm<changePasswordInterface>({
      resolver: yupResolver(changePasswordValidationSchema),
    });
  const { errors } = formState;

  useEffect(() => {
    dispatch(resetStates());
  }, [dispatch]);

  const toggleNewPassword = () => {
    setShowNewPassword((n) => !n);
  };

  const toggleConfirmNewPassword = () => {
    setShowConfirmNewPassword((n) => !n);
  };

  const onSubmit = (data: changePasswordInterface) => {
    dispatch(changePassword(data)).then((action) => {
      if (isFulfilled(action)) {
        toast.success("Successfully changed password.");
        reset();
      } else {
        toast.error(
          "Something went wrong while changing your password, try again later!",
        );
      }
    });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Header text="Security" />
      {status === "loading" ? (
        <CustomSpinner />
      ) : (
        <div className="flex h-full w-full flex-wrap items-center justify-around gap-2">
          <div className="mt-3 flex flex-grow flex-col items-start gap-3">
            <Header text="Change password" size={2} className="xl:!text-3xl" />
            <p className="mb-1 text-sm xxl:!text-xl">Password suggestions:</p>
            <ol className="ml-6 list-disc text-xs text-gray-500 xxl:!text-lg">
              <li>At least 6 characters</li>
              <li>At least 1 upper case letter (A-Z)</li>
              <li>At least 1 lower case letter (a-z)</li>
              <li>At least 1 number (0-9)</li>
            </ol>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-grow flex-col lg:!w-2/4 lg:!justify-start xxl:gap-3"
          >
            <div className="relative">
              <Input
                label="Current Password"
                id="currentPassword"
                required
                color={errors.currentPassword && "failure"}
                {...register("currentPassword")}
                type="password"
              >
                {errors.currentPassword ? (
                  <ErrorMessage text={errors.currentPassword?.message} />
                ) : (
                  status === "failed" && <ErrorMessage text={message} />
                )}
              </Input>
            </div>
            <div className="relative">
              <Input
                label="New password"
                id="newPassword"
                required
                color={errors.newPassword && "failure"}
                {...register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                error={errors.newPassword}
              >
                <div
                  className="absolute right-2 top-12 -translate-y-1/2 transform cursor-pointer xxl:!top-14"
                  onClick={toggleNewPassword}
                >
                  {showNewPassword ? (
                    <HiOutlineEyeSlash className="xxl:!size-6" />
                  ) : (
                    <HiOutlineEye className="xxl:!size-6" />
                  )}
                </div>
              </Input>
            </div>
            <div className="relative">
              <Input
                label="Confirm New Password"
                id="confirmNewPassword"
                required
                color={errors.confirmNewPassword && "failure"}
                {...register("confirmNewPassword")}
                type={showConfirmNewPassword ? "text" : "password"}
                error={errors.confirmNewPassword}
              >
                <div
                  className="absolute right-2 top-12 -translate-y-1/2 transform cursor-pointer xxl:!top-14"
                  onClick={toggleConfirmNewPassword}
                >
                  {showConfirmNewPassword ? (
                    <HiOutlineEyeSlash className="xxl:!size-6" />
                  ) : (
                    <HiOutlineEye className="xxl:!size-6" />
                  )}
                </div>
              </Input>
            </div>
            <CustomButton type="submit" className="mt-3">
              <p className="xxl:!text-lg">Save changes</p>
            </CustomButton>
          </form>
        </div>
      )}
    </div>
  );
};

export default Security;
