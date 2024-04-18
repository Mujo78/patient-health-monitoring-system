import React, { useMemo } from "react";
import Header from "../../../components/UI/Header";
import { setInfoAccessUser } from "../../../features/auth/authSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { doctorValidationSchema } from "../../../validations/doctorValidation";
import {
  availableDaysOptions,
  updateDoctorInfo,
  optionsType,
  doctorType,
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
import useAPI from "../../../hooks/useAPI";

const PersonalInfoDoc: React.FC = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, control, getValues, formState, reset } =
    useForm<doctorType>({ resolver: yupResolver(doctorValidationSchema) });
  const { errors, isDirty } = formState;

  const { data, loading, error, setError, setLoading } = useAPI<doctorType>(
    "/doctor/get-me",
    {
      checkData: true,
      onSuccess: reset,
    },
  );

  const onSubmit = async (data: doctorType) => {
    setError("");
    const days = data?.available_days?.map((n) => n.value);

    const dataToSend = {
      ...data,
      available_days: days,
    };

    if (dataToSend) {
      try {
        setLoading(true);
        const response = await updateDoctorInfo(dataToSend);

        if (!response.message) {
          reset(response);
          const userInfo = {
            first_name: data.first_name,
            last_name: data.last_name,
          };
          dispatch(setInfoAccessUser(userInfo));
          toast.success("Successfully updated profile.");
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        toast.error("An error occurred while updating your profile!");
        setError(err?.response?.data ?? err?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const days = getValues("available_days");

  const available_options: optionsType[] | undefined = useMemo(() => {
    if (!days) return undefined;

    return availableDaysOptions.filter(
      (m) => !days.some((d) => d.value === m.value),
    );
  }, [days]);

  return (
    <div className="flex h-full flex-col">
      <Header text="Personal information" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center"
      >
        {loading ? (
          <CustomSpinner />
        ) : data ? (
          <div className="flex h-full w-full flex-col justify-start gap-0.5 lg:!justify-start xxl:!gap-2">
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

            <div className="flex flex-wrap justify-between gap-3 lg:!flex-nowrap">
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

            <div className="flex flex-wrap justify-between gap-3 lg:!flex-nowrap">
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
                        : error?.includes("phone_number")
                          ? errorMessageConvert(error, "phone_number")
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
                  className="mt-1 text-xs focus:border-blue-700 focus:ring-blue-700"
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

            {error && !error.includes("Validation") && (
              <div className="my-4 flex h-full w-full items-start justify-start lg:!my-0">
                <ErrorMessage text={error} />
              </div>
            )}
          </div>
        ) : (
          error &&
          !error.includes("Validation") && (
            <div className="my-4 flex h-full w-full items-center justify-center lg:!my-0">
              <ErrorMessage text={error} />
            </div>
          )
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
