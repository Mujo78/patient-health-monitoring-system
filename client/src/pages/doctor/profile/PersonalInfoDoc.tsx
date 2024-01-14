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
import Input from "../../../components/UI/Input";

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
            <div className="w-full flex mt-1 gap-4">
              <div className="flex-grow">
                <Input
                  value="First Name"
                  id="first_name"
                  className="mt-1"
                  {...register("first_name")}
                  type="text"
                  color={errors.first_name && "failure"}
                  error={errors.first_name}
                />
              </div>
              <div className="flex-grow">
                <Input
                  value="Last Name"
                  id="last_name"
                  className="mt-1"
                  {...register("last_name")}
                  type="text"
                  color={errors.last_name && "failure"}
                  error={errors.last_name}
                />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex-grow">
                <Input
                  value="Qualification"
                  id="qualification"
                  className="mt-1"
                  {...register("qualification")}
                  type="text"
                  color={errors.qualification && "failure"}
                  error={errors.qualification}
                />
              </div>
              <div className="flex-grow">
                <Input
                  value="Speciality"
                  id="speciality"
                  className="mt-1"
                  {...register("speciality")}
                  type="text"
                  color={errors.speciality && "failure"}
                  error={errors.speciality}
                />
              </div>
              <div className="flex-grow">
                <Label
                  htmlFor="speciality"
                  className="text-sm"
                  value="Gender"
                />
                <CustomSelect
                  id="gender"
                  {...register("gender")}
                  color={errors.gender && "failure"}
                  className="mt-2"
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
            <div className="flex justify-between gap-4">
              <div className="w-2/5">
                <Input
                  value="Phone number"
                  id="phone_number"
                  className="mt-1"
                  {...register("phone_number")}
                  type="text"
                  color={errors.phone_number && "failure"}
                >
                  {errors.phone_number?.message
                    ? errors.phone_number?.message
                    : message?.includes("phone_number")
                    ? errorMessageConvert(message, "phone_number")
                    : ""}
                </Input>
              </div>
              <div className="w-3/5">
                <Input
                  value="Address"
                  id="address"
                  className="mt-1"
                  {...register("address")}
                  type="text"
                  color={errors.address && "failure"}
                  error={errors.address}
                />
              </div>
              <div className="w-2/6">
                <Input
                  value="Age"
                  id="age"
                  className="mt-1"
                  {...register("age")}
                  type="text"
                  color={errors.age && "failure"}
                  error={errors.age}
                />
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
