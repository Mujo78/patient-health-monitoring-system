import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import { useSelector } from "react-redux";
import { authUser, setInfoAccessUser } from "../../../features/auth/authSlice";
import { getData, updateData } from "../../../service/pharmacySideFunctions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  PharmacyType,
  PharmacyUpdateType,
  pharmacyValidationSchema,
} from "../../../validations/pharmacyValidation";
import { TextInput, Label, Textarea } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import { useAppDispatch } from "../../../app/hooks";
import { toast } from "react-hot-toast";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";

const InfoPharmacy: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState, reset } = useForm<PharmacyType>({
    resolver: yupResolver(pharmacyValidationSchema),
  });
  const { errors, isDirty } = formState;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessUser) {
          setLoading(true);
          const response = await getData(accessUser.token);
          const data = {
            ...response,
            from: response.working_hours
              .slice(0, response.working_hours.indexOf("AM"))
              .trim(),
            to: response.working_hours
              .slice(
                response.working_hours.indexOf("-") + 1,
                response.working_hours.indexOf("PM")
              )
              .trim(),
          };
          delete data.working_hours;
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

  const onSubmit = async (data: PharmacyType) => {
    try {
      setLoading(true);
      const dataToSend: PharmacyUpdateType = {
        ...data,
        working_hours: data.from + " AM" + " - " + data.to + " PM",
      };
      if (accessUser) {
        const res = await updateData(dataToSend, accessUser?.token);
        const data = {
          ...res,
          from: res.working_hours
            .slice(0, res.working_hours.indexOf("AM"))
            .trim(),
          to: res.working_hours
            .slice(
              res.working_hours.indexOf("-") + 1,
              res.working_hours.indexOf("PM")
            )
            .trim(),
        };
        reset(data);
        dispatch(setInfoAccessUser({ name: data.name }));
        toast.success("Successfully updated profile.");
      }
      setLoading(false);
    } catch (error: any) {
      toast.error("Something went wrong, please try again later!");
      setLoading(false);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <Header text="General information" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full h-full flex-col items-center"
      >
        {loading ? (
          <CustomSpinner />
        ) : (
          <div className="w-full flex flex-col h-full mt-3 justify-start">
            <FormRow over gap={4}>
              <Input
                autoComplete="true"
                value="Name"
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
                <div className="flex gap-4 mt-2 items-center">
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
                value="Address"
                id="address"
                {...register("address")}
                type="text"
                className="mt-1"
                color={errors.address && "failure"}
                error={errors.address}
              />

              <Input
                value="Phone number"
                id="phone_number"
                {...register("phone_number")}
                type="text"
                color={errors.phone_number && "failure"}
                className="mt-1"
                error={errors.phone_number}
              />
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
                  className="text-xs mt-1"
                />
                <ErrorMessage text={errors.description?.message} />
              </div>
            </FormRow>
          </div>
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
