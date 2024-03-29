import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import { useSelector } from "react-redux";
import { authUser, setInfoAccessUser } from "../../../features/auth/authSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  doctorType,
  doctorValidationSchema,
} from "../../../validations/doctorValidation";
import {
  availableDaysOptions,
  getDoctorInfo,
  updateDoctorInfo,
} from "../../../service/personSideFunctions";
import { Label, Textarea, Select as CustomSelect } from "flowbite-react";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../../../app/hooks";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";
import { genders } from "../../../validations/personValidation";

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
          setLoading(true);
          const response = await getDoctorInfo(accessUser.token);
          const data = {
            ...response,
            available_days: response.available_days.map((n: string) => ({
              value: n,
              label: n,
            })),
          };
          reset(data);
          setLoading(false);
        }
      } catch (err: any) {
        setLoading(false);
        toast.error("Something went wrong, please try again later!");
        throw new Error(err);
      }
    };
    fetchData();
  }, [accessUser, reset]);

  const onSubmit = async (data: doctorType) => {
    setMessage("");
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
        } else {
          setMessage(response.message);
        }
      } catch (err: any) {
        toast.error("Something went wrong, please try again later!");
        setMessage(err.message);
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
    <div className="flex flex-col h-full">
      <Header text="Personal information" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full h-full flex-col items-center"
      >
        {loading ? (
          <CustomSpinner />
        ) : (
          <div className="w-full flex gap-0.5 flex-col h-full justify-start lg:!justify-start xxl:!gap-2">
            <FormRow gap={3} className="flex lg:!flex-nowrap">
              <Input
                autoComplete="true"
                label="First Name"
                id="first_name"
                className="mt-1"
                {...register("first_name")}
                type="text"
                color={errors.first_name && "failure"}
                error={errors.first_name}
              />

              <Input
                label="Last Name"
                id="last_name"
                className="mt-1"
                {...register("last_name")}
                type="text"
                color={errors.last_name && "failure"}
                error={errors.last_name}
              />
            </FormRow>

            <div className="flex justify-between gap-3 flex-wrap lg:!flex-nowrap">
              <div className="flex-grow">
                <Input
                  label="Qualification"
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
                  label="Speciality"
                  id="speciality"
                  className="mt-1"
                  {...register("speciality")}
                  type="text"
                  color={errors.speciality && "failure"}
                  error={errors.speciality}
                />
              </div>
              <div className="flex-grow">
                <Input
                  label="Age"
                  id="age"
                  className="mt-1"
                  {...register("age")}
                  type="text"
                  color={errors.age && "failure"}
                  error={errors.age}
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 flex-wrap lg:!flex-nowrap">
              <div className="flex-grow">
                <Input
                  label="Phone number"
                  id="phone_number"
                  className="mt-1"
                  {...register("phone_number")}
                  type="text"
                  color={errors.phone_number && "failure"}
                >
                  <ErrorMessage
                    text={
                      errors?.phone_number?.message
                        ? errors?.phone_number?.message
                        : message?.includes("phone_number")
                        ? errorMessageConvert(message, "phone_number")
                        : ""
                    }
                  />
                </Input>
              </div>
              <div className="flex-grow">
                <Input
                  autoComplete="true"
                  label="Address"
                  id="address"
                  className="mt-1"
                  {...register("address")}
                  type="text"
                  color={errors.address && "failure"}
                  error={errors.address}
                />
              </div>
              <div className="flex-grow-0">
                <Label
                  htmlFor="gender"
                  className="text-sm xxl:!text-lg"
                  value="Gender"
                />
                <CustomSelect
                  id="gender"
                  {...register("gender")}
                  color={errors.gender && "failure"}
                  className="mt-1.5"
                >
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </CustomSelect>
                <ErrorMessage text={errors.gender?.message} />
              </div>
            </div>

            <FormRow
              gap={3}
              className="flex-col lg:!flex-row-reverse"
              fixed="w-full lg:!w-2/4 mb-1"
            >
              <>
                <Label
                  htmlFor="bio"
                  className="text-sm xxl:!text-lg"
                  value="Bio"
                />
                <Textarea
                  id="bio"
                  {...register("bio")}
                  color={errors.bio && "failure"}
                  rows={5}
                  className="text-xs mt-1"
                />
                <ErrorMessage text={errors.bio?.message} />
              </>
              <>
                <Controller
                  name="available_days"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label
                        htmlFor="available_days"
                        className="text-sm xxl:!text-lg"
                        value="Available days"
                      />

                      <Select
                        inputId="available_days"
                        options={available_options}
                        className="mt-1 text-xs xxl:!text-lg"
                        {...field}
                        isMulti
                        closeMenuOnSelect={false}
                      />
                    </>
                  )}
                />
                <ErrorMessage text={errors.available_days?.message} />
              </>
            </FormRow>
          </div>
        )}
        <Footer variant={1}>
          <CustomButton
            type="submit"
            className="mt-2 w-full lg:!w-fit"
            disabled={!isDirty}
          >
            <p className="text-md xxl:!text-lg">Save</p>
          </CustomButton>
        </Footer>
      </form>
    </div>
  );
};

export default PersonalInfoDoc;
