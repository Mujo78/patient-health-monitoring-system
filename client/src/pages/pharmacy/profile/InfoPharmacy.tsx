import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import { setInfoAccessUser } from "../../../features/auth/authSlice";
import {
  PharmacyType,
  getData,
  updateData,
} from "../../../service/pharmacySideFunctions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { pharmacyValidationSchema } from "../../../validations/pharmacyValidation";
import { TextInput, Label, Textarea } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import { useAppDispatch } from "../../../app/hooks";
import { toast } from "react-hot-toast";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";
import { errorMessageConvert } from "../../../service/authSideFunctions";

const InfoPharmacy: React.FC = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, reset } = useForm<PharmacyType>({
    resolver: yupResolver(pharmacyValidationSchema),
  });
  const { errors, isDirty } = formState;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PharmacyType>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getData();
        setData(response);
        reset(response);
      } catch (err: any) {
        setError(err?.response?.data ?? err?.message);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: PharmacyType) => {
    try {
      setLoading(true);
      const res = await updateData(data);
      setData(res);
      reset(res);
      dispatch(setInfoAccessUser({ name: res.name }));
      toast.success("Successfully updated profile.");
    } catch (error: any) {
      setError(error?.response?.data ?? error?.message);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <Header text="General information" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center"
      >
        {loading ? (
          <CustomSpinner />
        ) : data ? (
          <div className="mt-3 flex h-full w-full flex-col justify-start">
            <FormRow over gap={4}>
              <Input
                autoComplete="true"
                label="Name"
                id="name"
                {...register("name")}
                type="text"
                className="mt-1"
                color={errors.name && "failure"}
                error={errors.name}
              />

              <div>
                <Label
                  htmlFor="from"
                  className="text-sm xxl:!text-lg"
                  value="Working Hours (from - to)"
                />
                <div className="mt-2 flex items-center gap-4">
                  <TextInput
                    id="from"
                    {...register("from")}
                    min={1}
                    max={12}
                    type="number"
                    className="w-1/4"
                    color={errors.from && "failure"}
                  />
                  <TextInput
                    {...register("to")}
                    className="w-1/4"
                    min={1}
                    max={12}
                    type="number"
                    color={errors.to && "failure"}
                  />
                  <p className="text-md">AM - PM</p>
                </div>
                <ErrorMessage
                  text={errors.from?.message || errors.to?.message}
                />
              </div>
            </FormRow>

            <FormRow gap={4}>
              <Input
                autoComplete="true"
                label="Address"
                id="address"
                {...register("address")}
                type="text"
                className="mt-1"
                color={errors.address && "failure"}
                error={errors.address}
              />

              <Input
                label="Phone number"
                id="phone_number"
                {...register("phone_number")}
                type="text"
                color={errors.phone_number && "failure"}
                className="mt-1"
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
            </FormRow>

            <FormRow>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm xxl:!text-lg"
                  value="Description"
                />
                <Textarea
                  id="description"
                  {...register("description")}
                  color={errors.description && "failure"}
                  rows={4}
                  className="mt-1 text-xs focus:!border-blue-700 focus:!ring-blue-700"
                />
                <ErrorMessage text={errors.description?.message} />
              </div>
            </FormRow>

            {!error.includes("validation") && (
              <div className="my-4 flex h-full w-full items-start justify-start lg:!my-0">
                <ErrorMessage text={error} />
              </div>
            )}
          </div>
        ) : (
          !error.includes("validation") && (
            <div className="my-4 flex h-full w-full items-center justify-center lg:!my-0">
              <ErrorMessage text={error} />
            </div>
          )
        )}
        <Footer variant={1} className="mt-3 lg:!mt-0">
          <CustomButton
            type="submit"
            className="mt-3 w-full lg:!w-fit"
            disabled={loading || !isDirty}
          >
            <p className="xxl:!text-lg">Save</p>
          </CustomButton>
        </Footer>
      </form>
    </div>
  );
};

export default InfoPharmacy;
