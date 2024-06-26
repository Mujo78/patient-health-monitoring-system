import React from "react";
import Header from "../../../components/UI/Header";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import { useForm } from "react-hook-form";
import {
  bloodTypes,
  genders,
  personValidationSchema,
} from "../../../validations/personValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, Select } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { updateMe, patient } from "../../../service/personSideFunctions";
import { setInfoAccessUser } from "../../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../../../app/hooks";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import moment from "moment";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";
import useAPI from "../../../hooks/useAPI";

const PersonalInformation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, reset } = useForm<patient>({
    resolver: yupResolver(personValidationSchema),
  });
  const { errors, isDirty } = formState;

  const { data, loading, error, setError, setLoading } = useAPI<patient>(
    "/patient/get-me",
    { onSuccess: reset },
  );

  const onSubmit = async (data: patient) => {
    setError("");
    const formatted = moment(data.date_of_birth).utc(true).format("YYYY-MM-DD");
    const realData: unknown = { ...data, date_of_birth: formatted };

    if (realData) {
      try {
        setLoading(true);
        const response = await updateMe(realData);
        if (!response.message) {
          reset(response);
          const userInfo = {
            first_name: response.first_name,
            last_name: response.last_name,
          };
          setError("");
          dispatch(setInfoAccessUser(userInfo));
          toast.success("Successfully updated profile.");
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError(err?.response?.data ?? err?.message);
        toast.error("An error occurred while updating your profile!");
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Header text="Personal information" />
      <div className="flex h-full flex-col justify-between">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col items-center"
        >
          {loading ? (
            <CustomSpinner />
          ) : data ? (
            <div className="flex h-full w-full flex-col items-center lg:!justify-start xl:!mt-3 xl:gap-3">
              <FormRow gap={3} className="flex lg:!flex-nowrap">
                <Input
                  autoComplete="true"
                  label="First Name"
                  id="first_name"
                  {...register("first_name")}
                  type="text"
                  color={errors.first_name && "failure"}
                  error={errors.first_name}
                />

                <Input
                  label="Last Name"
                  id="last_name"
                  {...register("last_name")}
                  type="text"
                  color={errors.last_name && "failure"}
                  error={errors.last_name}
                />
              </FormRow>
              <FormRow gap={3} over>
                <Input
                  autoComplete="true"
                  label="Address"
                  id="address"
                  {...register("address")}
                  type="text"
                  color={errors.address && "failure"}
                  error={errors.address}
                />

                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm xxl:!text-lg"
                    value="Gender"
                  />
                  <Select
                    id="gender"
                    {...register("gender")}
                    color={errors.gender && "failure"}
                    className="mt-1.5 focus:!border-blue-700 "
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage text={errors.gender?.message} />
                </div>
              </FormRow>

              <FormRow gap={3} over>
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
                        : error
                          ? errorMessageConvert(error, "phone_number")
                          : ""
                    }
                  />
                </Input>

                <div>
                  <Label
                    htmlFor="blood_type"
                    className="text-sm  xxl:!text-lg"
                    value="Blood Type"
                  />
                  <Select
                    id="blood_type"
                    {...register("blood_type")}
                    color={errors.blood_type && "failure"}
                    className="mt-1.5"
                  >
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage text={errors.blood_type?.message} />
                </div>
              </FormRow>

              <div className="flex w-full flex-col justify-between xl:!flex-row xl:!gap-3">
                <div className="flex-grow">
                  <Input
                    label="Birth Date"
                    type="date"
                    id="date_of_birth"
                    {...register("date_of_birth")}
                    color={errors.date_of_birth && "failure"}
                    error={errors.date_of_birth}
                  />
                </div>
                <div className="flex flex-grow flex-wrap justify-between gap-3 lg:!flex-nowrap xl:!flex-grow-0">
                  <div className="flex-grow">
                    <Input
                      label="Weight (kg)"
                      type="number"
                      id="weight"
                      {...register("weight")}
                      color={errors.weight && "failure"}
                      error={errors.weight}
                    />
                  </div>
                  <div className="flex-grow">
                    <Input
                      label="Height (cm)"
                      type="number"
                      id="height"
                      {...register("height")}
                      color={errors.height && "failure"}
                      error={errors.height}
                    />
                  </div>
                </div>
              </div>

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
              className="mt-3 w-full md:!w-fit"
              disabled={!isDirty}
            >
              <p className="xxl:!text-lg">Save</p>
            </CustomButton>
          </Footer>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
