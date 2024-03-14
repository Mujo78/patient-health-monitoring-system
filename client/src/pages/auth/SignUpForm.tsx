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
import { useSelector } from "react-redux";
import { errorMessageConvert } from "../../service/authSideFunctions";
import { HiOutlineEyeSlash, HiOutlineEye } from "react-icons/hi2";
import Input from "../../components/UI/Input";
import CustomSpinner from "../../components/UI/CustomSpinner";

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
  const { status, message } = useSelector(authUser);

  useEffect(() => {
    let objectURL: string;
    if (selectedOne) {
      objectURL = URL.createObjectURL(selectedOne);
      setImage(objectURL);
    }

    return () => URL.revokeObjectURL(objectURL);
  }, [getValues, selectedOne]);

  const onSubmit = async (data: PatientUser) => {
    dispatch(signup(data));
  };

  const togglePassword = () => {
    setShowNewPassword((n) => !n);
  };

  useEffect(() => {
    if (status === "idle") reset();
  }, [status, reset]);

  return (
    <div className="flex flex-col-reverse w-full md:!flex-row-reverse ">
      <div className="mt-auto md:!h-screen md:!ml-auto md:!mx-0 mx-auto">
        <Logo />
      </div>

      <div className="w-full md:!my-auto md:!w-3/4 h-full ml-auto flex justify-center items-center flex-col">
        {status === "loading" ? (
          <CustomSpinner size="lg" />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex w-full justify-center flex-col gap-3 xxl:!gap-5 items-center"
          >
            <h1 className="text-3xl lg:!text-5xl text-center flex justify-center font-bold">
              Create a new account
            </h1>
            <div className="w-full xl:!w-5/6 flex flex-col gap-3 xxl:!gap-5 md:!gap-1 items-center justify-center">
              <div className="flex w-full flex-wrap gap-3 justify-between">
                <div className="border mx-auto relative rounded-lg">
                  <img
                    src={photo?.length > 0 ? Image : img}
                    className="rounded-lg w-44 xxl:!w-56 h-auto"
                    alt="Profile picture"
                  />
                  <div className="absolute bottom-4 right-2 w-5 h-2 text-xl font-bold text-white ">
                    <label
                      htmlFor="inputFile"
                      className=" bg-blue-700 px-2 rounded-3xl border-2  cursor-pointer border-blue-700"
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
                <div className="flex flex-grow flex-wrap flex-col lg:!w-3/5">
                  <Input
                    value="First name"
                    error={errors.first_name}
                    id="first_name"
                    {...register("first_name")}
                    type="text"
                    color={errors.first_name && "failure"}
                  />

                  <Input
                    value="Last Name"
                    error={errors.last_name}
                    id="last_name"
                    {...register("last_name")}
                    type="text"
                    color={errors.last_name && "failure"}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 w-full justify-between">
                <div className="flex-grow">
                  <Input
                    value="Address"
                    error={errors.address}
                    id="address"
                    {...register("address")}
                    type="text"
                    color={errors.address && "failure"}
                  />
                </div>
                <div className="flex-grow-0">
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                  <ErrorMessage text={errors.gender?.message} />
                </div>
              </div>
              <div className="flex justify-between gap-3 flex-wrap w-full">
                <div className="flex-grow">
                  <Input
                    value={"Phone number"}
                    id="phone_number"
                    {...register("phone_number")}
                    type="text"
                    color={errors.phone_number && "failure"}
                  >
                    <ErrorMessage
                      className="text-sm xxl:!text-md"
                      text={
                        errors.phone_number?.message
                          ? errors.phone_number.message
                          : message?.includes("phone_number:")
                          ? errorMessageConvert(message, "phone_number")
                          : ""
                      }
                    />
                  </Input>
                </div>
                <div className="flex-grow md:!flex-grow-0">
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
                    <option value="A+"> A+ </option>
                    <option value="A-"> A- </option>
                    <option value="B+"> B+ </option>
                    <option value="B-"> B- </option>
                    <option value="AB+"> AB+ </option>
                    <option value="AB-"> AB- </option>
                    <option value="O+"> O+ </option>
                    <option value="O-"> O- </option>
                  </Select>
                  <ErrorMessage text={errors.blood_type?.message} />
                </div>
              </div>
              <div className="flex w-full gap-3 flex-wrap justify-between">
                <div className="flex-grow">
                  <Input
                    value="Email"
                    id="email"
                    {...register("email")}
                    type="text"
                    color={errors.email && "failure"}
                  >
                    <ErrorMessage
                      className="text-sm xxl:!text-md"
                      text={
                        errors.email?.message
                          ? errors.email.message
                          : message.includes("email:")
                          ? errorMessageConvert(message, "email")
                          : ""
                      }
                    />
                  </Input>
                </div>
                <div className="flex-grow md:!flex-grow-0">
                  <Input
                    value="Birth Date"
                    type="date"
                    id="date_of_birth"
                    {...register("date_of_birth")}
                    color={errors.date_of_birth && "failure"}
                    error={errors.date_of_birth}
                  />
                </div>
              </div>
              <div className="relative w-full">
                <Input
                  value="Password"
                  {...register("password")}
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  color={errors.password && "failure"}
                  error={errors.password}
                >
                  <div
                    className="absolute right-2 top-12 xxl:!top-14 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePassword}
                  >
                    {showNewPassword ? (
                      <HiOutlineEyeSlash className="xxl:w-6 xxl:h-6" />
                    ) : (
                      <HiOutlineEye className="xxl:w-6 xxl:h-6" />
                    )}
                  </div>
                </Input>
              </div>

              <div className="w-full">
                <Input
                  value="Confirm password"
                  id="passwordConfirm"
                  type="password"
                  {...register("passwordConfirm")}
                  color={errors.passwordConfirm && "failure"}
                  error={errors.passwordConfirm}
                />
              </div>

              <div className="flex justify-between w-full gap-2 pb-6 md:!pb-0 flex-wrap md:!flex-nowrap">
                {status === "idle" && (
                  <Alert className="flex xxl:!text-lg items-center w-fit justify-center h-10 text-center">
                    <strong>Action Required:</strong> Please verify your email
                    address.
                  </Alert>
                )}
                <CustomButton
                  className="w-full md:!ml-auto md:!w-1/3 lg:!w-fit"
                  type="submit"
                >
                  <p className="xxl:text-xl">Sign up</p>
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
