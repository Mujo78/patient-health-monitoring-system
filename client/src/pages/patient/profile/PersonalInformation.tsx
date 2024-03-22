import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import { useForm } from "react-hook-form";
import {
  bloodTypes,
  genders,
  patient,
  personValidationSchema,
} from "../../../validations/personValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, Select } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { getMe, updateMe } from "../../../service/personSideFunctions";
import { useSelector } from "react-redux";
import { authUser, setInfoAccessUser } from "../../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "../../../app/hooks";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import moment from "moment";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";

const PersonalInformation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, reset } = useForm<patient>({
    resolver: yupResolver(personValidationSchema),
  });
  const { errors, isDirty } = formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessUser) {
          const response = await getMe(accessUser.token);
          reset(response);
        }
      } catch (err: any) {
        toast.error("Something went wrong, please try again later!");
        throw new Error(err);
      }
    };

    fetchData();
  }, [accessUser, reset]);

  const onSubmit = async (data: patient) => {
    const value = moment().isDST() ? 2 : 1;
    const formatted = moment(data.date_of_birth).add(value, "hours");
    const realData: unknown = {
      ...data,
      date_of_birth: formatted.toISOString().split("T")[0],
    };

    if (realData && accessUser) {
      try {
        setLoading(true);
        const response = await updateMe(accessUser.token, realData);
        setMessage("");

        if (!response.message) {
          reset(response);
          const userInfo = {
            first_name: response.first_name,
            last_name: response.last_name,
          };
          setMessage("");
          dispatch(setInfoAccessUser(userInfo));
          toast.success("Successfully updated profile.");
        } else {
          setMessage(response.message);
        }
      } catch (err: any) {
        setLoading(false);
        toast.error("Something went wrong, please try again later!");
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Header text="Personal information" />
      <div className="flex flex-col justify-between h-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full h-full flex-col items-center"
        >
          {loading ? (
            <CustomSpinner />
          ) : (
            <div className="w-full h-full flex flex-col items-center lg:!justify-start xl:!mt-3 xl:gap-3">
              <FormRow gap={3} className="flex lg:!flex-nowrap">
                <Input
                  value="First Name"
                  id="first_name"
                  {...register("first_name")}
                  type="text"
                  color={errors.first_name && "failure"}
                  error={errors.first_name}
                />

                <Input
                  value="Last Name"
                  id="last_name"
                  {...register("last_name")}
                  type="text"
                  color={errors.last_name && "failure"}
                  error={errors.last_name}
                />
              </FormRow>
              <FormRow gap={3} over>
                <Input
                  value="Address"
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
                    className="mt-1.5"
                  >
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage
                    text={errors.gender?.message}
                    size="xs"
                    className="mt-1 xxl:!text-[1rem]"
                  />
                </div>
              </FormRow>

              <FormRow gap={3} over>
                <Input
                  value="Phone number"
                  id="phone_number"
                  {...register("phone_number")}
                  type="text"
                  color={errors.phone_number && "failure"}
                >
                  <ErrorMessage
                    size="xs"
                    className="mt-1 xxl:!text-[1rem]"
                    text={
                      errors.phone_number?.message
                        ? errors.phone_number.message
                        : message
                        ? errorMessageConvert(message, "phone_number")
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
                  <ErrorMessage
                    text={errors.blood_type?.message}
                    size="xs"
                    className="mt-1 xxl:!text-[1rem]"
                  />
                </div>
              </FormRow>

              <div className="flex justify-between w-full flex-col xl:!flex-row xl:!gap-3">
                <div className="flex-grow">
                  <Input
                    value="Birth Date"
                    type="date"
                    id="date_of_birth"
                    {...register("date_of_birth")}
                    color={errors.date_of_birth && "failure"}
                    error={errors.date_of_birth}
                  />
                </div>
                <div className="flex gap-3 flex-grow xl:!flex-grow-0 justify-between flex-wrap lg:!flex-nowrap">
                  <div className="flex-grow">
                    <Input
                      value="Weight (kg)"
                      type="number"
                      id="weight"
                      {...register("weight")}
                      color={errors.weight && "failure"}
                      error={errors.weight}
                    />
                  </div>
                  <div className="flex-grow">
                    <Input
                      value="Height (cm)"
                      type="number"
                      id="height"
                      {...register("height")}
                      color={errors.height && "failure"}
                      error={errors.height}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <Footer variant={1}>
            <CustomButton
              type="submit"
              className="mt-3 w-full md:!w-fit"
              disabled={!isDirty}
            >
              <p className=" xxl:!text-lg">Save</p>
            </CustomButton>
          </Footer>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
