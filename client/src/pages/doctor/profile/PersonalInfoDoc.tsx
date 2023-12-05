import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import { authUser, setInfoAccessUser } from "../../../features/auth/authSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  doctorType,
  doctorValidationSchema,
} from "../../../validations/doctorValidation";
import {
  getDoctorInfo,
  updateDoctorInfo,
} from "../../../service/personSideFunctions";
import {
  Label,
  Spinner,
  TextInput,
  Textarea,
  Select as CustomSelect,
} from "flowbite-react";
import Footer from "../../../components/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../../../app/hooks";
import { errorMessageConvert } from "../../../service/authSideFunctions";

const availableDaysOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

type OptionDays = {
  value: string;
  label: string;
};

const PersonalInfoDoc: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, formState, getValues, reset } =
    useForm<doctorType>({ resolver: yupResolver(doctorValidationSchema) });
  const { errors, isDirty } = formState;
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessUser) {
          const response = await getDoctorInfo(accessUser.token);
          const data = {
            ...response,
            available_days: response.available_days.map((n: string) => ({
              value: n,
              label: n,
            })),
          };
          reset(data);
        }
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchData();
  }, [accessUser, reset]);

  const onSubmit = async (data: doctorType) => {
    console.log(data);
    const days = data?.available_days?.map((n) => n.value);

    const dataToSend = {
      ...data,
      available_days: days,
    };

    if (dataToSend && accessUser) {
      try {
        setLoading(true);
        const response = await updateDoctorInfo(accessUser.token, dataToSend);
        if (!response.message) {
          const data = {
            ...response,
            available_days: response.available_days.map((n: string) => ({
              value: n,
              label: n,
            })),
          };
          reset(data);
          const userInfo = {
            first_name: data.first_name,
            last_name: data.last_name,
          };
          dispatch(setInfoAccessUser(userInfo));
          toast.success("Successfully updated profile.");
        }
        setMessage(response.message);
      } catch (err: any) {
        console.log(err);
        setMessage(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const days = getValues("available_days")?.map((n) => ({
    value: n.value,
    label: n.label,
  }));

  const available_options: OptionDays[] = availableDaysOptions?.filter(
    (m) => !days?.some((d) => d.value === m.value)
  );

  return (
    <div className="flex flex-col justify-between h-full">
      <Header text="Personal information" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full h-full flex-col items-center"
      >
        {loading ? (
          <div className="mx-auto my-auto">
            <Spinner />
          </div>
        ) : (
          <div className="w-full flex text-xs gap-1 flex-col h-full justify-center">
            <div className="w-full flex mt-1">
              <div className="flex-grow mr-3">
                <Label
                  htmlFor="first_name"
                  className="text-xs"
                  value="First Name"
                />
                <TextInput
                  id="first_name"
                  className="mt-1"
                  {...register("first_name")}
                  type="text"
                  color={errors.first_name && "failure"}
                />
                <ErrorMessage
                  text={errors.first_name?.message}
                  className="text-xs"
                />
              </div>
              <div className="flex-grow ml-3">
                <Label
                  htmlFor="last_name"
                  className="text-xs"
                  value="Last Name"
                />
                <TextInput
                  id="last_name"
                  className="mt-1"
                  {...register("last_name")}
                  type="text"
                  color={errors.last_name && "failure"}
                />
                <ErrorMessage
                  text={errors.last_name?.message}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex-grow mr-3">
                <Label
                  htmlFor="qualification"
                  className="text-xs"
                  value="Qualification"
                />
                <TextInput
                  id="qualification"
                  className="mt-1"
                  {...register("qualification")}
                  type="text"
                  color={errors.qualification && "failure"}
                />
                <ErrorMessage
                  text={errors.qualification?.message}
                  className="text-xs"
                />
              </div>
              <div className="flex-grow ml-3">
                <Label
                  htmlFor="speciality"
                  className="text-xs"
                  value="Speciality"
                />
                <TextInput
                  id="speciality"
                  className="mt-1"
                  {...register("speciality")}
                  type="text"
                  color={errors.speciality && "failure"}
                />
                <ErrorMessage
                  text={errors.speciality?.message}
                  className="text-xs"
                />
              </div>
              <div className="flex-grow ml-3">
                <Label
                  htmlFor="speciality"
                  className="text-xs"
                  value="Gender"
                />
                <CustomSelect
                  id="gender"
                  {...register("gender")}
                  color={errors.gender && "failure"}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </CustomSelect>
                <ErrorMessage
                  text={errors.gender?.message}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-2/5">
                <Label
                  htmlFor="phone_number"
                  className="text-xs"
                  value="Phone number"
                />
                <TextInput
                  id="phone_number"
                  className="mt-1"
                  {...register("phone_number")}
                  type="text"
                  color={errors.phone_number && "failure"}
                />
                <ErrorMessage
                  text={
                    errors.phone_number?.message ||
                    message?.includes("phone_number")
                      ? errorMessageConvert(message, "phone_number")
                      : ""
                  }
                  className="text-xs"
                />
              </div>
              <div className="w-3/5 pl-3 pr-3">
                <Label htmlFor="address" className="text-xs" value="Address" />
                <TextInput
                  id="address"
                  className="mt-1"
                  {...register("address")}
                  type="text"
                  color={errors.address && "failure"}
                />
                <ErrorMessage
                  text={errors.address?.message}
                  className="text-xs"
                />
              </div>
              <div className="w-2/6">
                <Label htmlFor="age" className="text-xs" value="Age" />
                <TextInput
                  id="age"
                  className="mt-1"
                  {...register("age")}
                  type="text"
                  color={errors.age && "failure"}
                />
                <ErrorMessage text={errors.age?.message} className="text-xs" />
              </div>
            </div>
            <div className="flex gap-4 justify-center items-center">
              <div className="w-full">
                <Label
                  htmlFor="available_days"
                  className="text-xs"
                  value="Available days"
                />
                <Controller
                  name="available_days"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={available_options}
                      id="available_days"
                      className="mt-1"
                      {...field}
                      isMulti
                      closeMenuOnSelect={false}
                    />
                  )}
                />
                <ErrorMessage
                  text={errors.available_days?.message}
                  className="text-xs"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="bio" className="text-xs" value="Bio" />
                <Textarea
                  id="bio"
                  {...register("bio")}
                  color={errors.bio && "failure"}
                  rows={5}
                  className="text-xs mt-1"
                />
                <ErrorMessage text={errors.bio?.message} className="text-xs" />
              </div>
            </div>
          </div>
        )}
        <Footer variant={1}>
          <CustomButton type="submit" className="mt-3" disabled={!isDirty}>
            Save
          </CustomButton>
        </Footer>
      </form>
    </div>
  );
};

export default PersonalInfoDoc;
