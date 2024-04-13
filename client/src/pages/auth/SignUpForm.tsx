import React, { useEffect, useState } from "react";
import Logo from "../../components/UI/Logo";
import { Alert, Label, Select } from "flowbite-react";
import img from "../../assets/default.jpg";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/hooks";
import { PatientUser, authUser, signup } from "../../features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupValidationSchema } from "../../validations/auth/signupValidation";
import ErrorMessage from "../../components/UI/ErrorMessage";
import CustomButton from "../../components/UI/CustomButton";
import { shallowEqual, useSelector } from "react-redux";
import { errorMessageConvert } from "../../service/authSideFunctions";
import { HiOutlineEyeSlash, HiOutlineEye } from "react-icons/hi2";
import Input from "../../components/UI/Input";
import CustomSpinner from "../../components/UI/CustomSpinner";
import FormRow from "../../components/UI/FormRow";
import { bloodTypes, genders } from "../../validations/personValidation";
import Header from "../../components/UI/Header";
import { isFulfilled } from "@reduxjs/toolkit";

const SignUpForm: React.FC = () => {
  const [Image, setImage] = useState("");
  const { register, getValues, handleSubmit, watch, formState, reset } =
    useForm<PatientUser>({ resolver: yupResolver(signupValidationSchema) });
  const { errors } = formState;
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const photo = watch("photo");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const selectedOne = photo?.length ? photo[0] : null;
  const dispatch = useAppDispatch();
  const { status, message } = useSelector(authUser, shallowEqual);

  useEffect(() => {
    let objectURL: string;
    if (selectedOne) {
      objectURL = URL.createObjectURL(selectedOne);
      setImage(objectURL);
    }

    return () => URL.revokeObjectURL(objectURL);
  }, [getValues, selectedOne]);

  const onSubmit = async (data: PatientUser) => {
    dispatch(signup(data)).then((action) => {
      if (isFulfilled(action)) {
        reset();
      }
    });
  };

  const togglePassword = () => {
    setShowNewPassword((n) => !n);
  };

  return (
    <div className="flex w-full flex-col-reverse md:!flex-row-reverse ">
      <div className="mx-auto md:!mx-0 md:!ml-auto md:!h-screen">
        <Logo />
      </div>

      <div className="ml-auto flex h-full w-full flex-col items-center justify-center md:!my-auto md:!w-3/4">
        {status === "loading" ? (
          <CustomSpinner size="lg" />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex w-full flex-col items-center justify-center gap-2 xxl:!gap-5"
          >
            <Header text="Create a new account" bold size={3} />

            <div className="flex w-full flex-col items-center justify-center gap-1 md:!gap-0 xl:!w-5/6 xxl:!gap-5">
              <FormRow
                className="flex-col-reverse gap-6 md:!flex-row-reverse"
                over
              >
                <FormRow className="flex-col">
                  <Input
                    autoComplete="true"
                    label="First name"
                    error={errors.first_name}
                    id="first_name"
                    {...register("first_name")}
                    type="text"
                    color={errors.first_name && "failure"}
                  />

                  <Input
                    label="Last Name"
                    error={errors.last_name}
                    id="last_name"
                    {...register("last_name")}
                    type="text"
                    color={errors.last_name && "failure"}
                  />
                </FormRow>
                <div className="relative mx-auto flex justify-center rounded-lg border">
                  <img
                    src={photo?.length > 0 ? Image : img}
                    className="h-auto w-44 rounded-lg xxl:!w-56"
                    alt="Profile picture"
                  />
                  <div className="absolute bottom-4 right-2 h-2 w-5 text-xl font-bold text-white ">
                    <label
                      htmlFor="inputFile"
                      className=" cursor-pointer rounded-3xl border-2 border-blue-700  bg-blue-700 px-2"
                    >
                      +
                    </label>
                    <input
                      type="file"
                      id="inputFile"
                      {...register("photo")}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
              </FormRow>

              <FormRow over>
                <Input
                  autoComplete="true"
                  label="Address"
                  error={errors.address}
                  id="address"
                  {...register("address")}
                  type="text"
                  color={errors.address && "failure"}
                />
                <>
                  <Label
                    htmlFor="gender"
                    value="Gender"
                    className="xxl:!text-lg"
                  />
                  <Select
                    className="mt-1.5"
                    id="gender"
                    {...register("gender")}
                    color={errors.gender && "failure"}
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage text={errors.gender?.message} />
                </>
              </FormRow>

              <FormRow over>
                <Input
                  label="Phone number"
                  id="phone_number"
                  {...register("phone_number")}
                  type="text"
                  color={errors.phone_number && "failure"}
                >
                  <ErrorMessage
                    text={
                      errors.phone_number?.message
                        ? errors.phone_number.message
                        : message?.includes("phone_number:")
                          ? errorMessageConvert(message, "phone_number")
                          : ""
                    }
                  />
                </Input>
                <>
                  <Label
                    htmlFor="blood_type"
                    value="Blood Type"
                    className="xxl:!text-lg"
                  />
                  <Select
                    className="mt-1.5"
                    id="blood_type"
                    {...register("blood_type")}
                    color={errors.blood_type && "failure"}
                  >
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage text={errors.blood_type?.message} />
                </>
              </FormRow>

              <FormRow over>
                <Input
                  autoComplete="true"
                  label="Email"
                  id="email"
                  {...register("email")}
                  type="text"
                  color={errors.email && "failure"}
                >
                  <ErrorMessage
                    text={
                      errors.email?.message
                        ? errors.email.message
                        : message.includes("email:")
                          ? errorMessageConvert(message, "email")
                          : ""
                    }
                  />
                </Input>

                <Input
                  label="Birth Date"
                  type="date"
                  id="date_of_birth"
                  {...register("date_of_birth")}
                  color={errors.date_of_birth && "failure"}
                  error={errors.date_of_birth}
                />
              </FormRow>

              <FormRow>
                <div className="relative">
                  <Input
                    label="Password"
                    {...register("password")}
                    id="password"
                    className="relative"
                    type={showNewPassword ? "text" : "password"}
                    color={errors.password && "failure"}
                    error={errors.password}
                  >
                    <div
                      className="absolute right-2 top-12 -translate-y-1/2 transform cursor-pointer xxl:!top-14"
                      onClick={togglePassword}
                    >
                      {showNewPassword ? (
                        <HiOutlineEyeSlash className="xxl:h-6 xxl:w-6" />
                      ) : (
                        <HiOutlineEye className="xxl:h-6 xxl:w-6" />
                      )}
                    </div>
                  </Input>
                </div>
              </FormRow>

              <FormRow>
                <Input
                  label="Confirm password"
                  id="passwordConfirm"
                  type="password"
                  {...register("passwordConfirm")}
                  color={errors.passwordConfirm && "failure"}
                  error={errors.passwordConfirm}
                />
              </FormRow>

              <div className="flex w-full flex-wrap justify-between gap-2 pb-6 md:!flex-nowrap md:!pb-0">
                {status === "idle" ? (
                  <Alert className="flex h-10 w-fit items-center justify-center xxl:!text-lg">
                    <strong>Action Required:</strong> Please verify your email
                    address.
                  </Alert>
                ) : (
                  !message.includes("validation") && (
                    <ErrorMessage text={message} />
                  )
                )}
                <CustomButton
                  className="w-full md:!ml-auto md:!w-1/3 lg:!w-fit"
                  type="submit"
                >
                  <p className="xxl:text-lg">Sign up</p>
                </CustomButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
