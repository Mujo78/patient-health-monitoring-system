import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import Footer from "../../../components/UI/Footer";
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useSelector } from "react-redux";
import {
  updateUser,
  authUser,
  deactivateAccount,
  logout,
  reset,
} from "../../../features/auth/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import CustomButton from "../../../components/UI/CustomButton";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { toast } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  generalPatientSettings,
  patientGeneralSettings,
} from "../../../validations/personValidation";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";

const GeneralSettings: React.FC = () => {
  const { accessUser, status, message: errorMessage } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const [deactivate, setDeactivate] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<patientGeneralSettings>({
    resolver: yupResolver(generalPatientSettings),
  });
  const { errors, isDirty } = formState;

  useEffect(() => {
    dispatch(reset());

    if (accessUser?.data) {
      const data = {
        email: accessUser.data.email,
        notification: accessUser.data.notification,
      };
      resetForm(data);
    }
  }, [dispatch, accessUser, resetForm]);

  const onSubmit = (data: patientGeneralSettings) => {
    dispatch(updateUser(data)).then((action) => {
      if (
        typeof action.payload === "object" &&
        Object.prototype.hasOwnProperty.call(action.payload, "_id")
      ) {
        toast.success("Account successfully updated");
      } else {
        toast.error("Something went wrong, please try again later!");
      }
    });
  };

  const closeModal = () => {
    if (deactivate) setDeactivate(false);
  };

  const handleOperation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deactivate) {
      const data: { active: boolean } = { active: false };
      dispatch(deactivateAccount(data)).then((action) => {
        if (
          typeof action?.payload === "object" &&
          Object.prototype.hasOwnProperty.call(action.payload, "_id")
        ) {
          setDeactivate(false);
          dispatch(logout());
        } else {
          toast.error("Something went wrong, please try again later!");
        }
      });
    }
  };

  useEffect(() => {
    if (status === "failed" && !errorMessage)
      toast.error("Something went wrong, please try again later!");
  }, [status, errorMessage]);

  return (
    <div className="flex flex-col h-full">
      <Header text="General settings" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="h-full py-5 flex flex-col gap-4">
          {status === "loading" ? (
            <CustomSpinner />
          ) : (
            <>
              <>
                <p className="flex justify-between">
                  <span className="text-blue-700 xxl:!text-xl font-semibold">
                    Patient
                  </span>
                  <span className="font-bold xxl:!text-2xl">
                    {accessUser?.info.first_name +
                      " " +
                      accessUser?.info.last_name}
                  </span>
                </p>
              </>

              <FormRow className="items-center">
                <Label
                  className="text-sm xxl:!text-lg"
                  htmlFor="email"
                  value="Your email"
                />
                <>
                  <div className="flex flex-col flex-grow ml-auto xl:!w-11/12">
                    <TextInput
                      autoComplete="true"
                      id="email"
                      color={errors.email && "failure"}
                      {...register("email")}
                      required
                      type="email"
                    />

                    <ErrorMessage
                      text={
                        errors.email?.message
                          ? errors.email.message
                          : errorMessage?.includes("email")
                          ? errorMessageConvert(errorMessage, "email")
                          : ""
                      }
                    />
                  </div>
                </>
              </FormRow>

              <div className="flex items-center mt-3 justify-between">
                <Label
                  className="text-sm xxl:!text-lg"
                  htmlFor="notification"
                  value="Email notifications"
                />
                <Controller
                  control={control}
                  name="notification"
                  render={({ field: { value, onChange } }) => (
                    <ToggleSwitch
                      id="notification"
                      label=""
                      color="success"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>

              <div className="flex items-center mt-3 justify-between">
                <Label
                  className="text-sm xxl:!text-lg"
                  htmlFor="deactivate"
                  value="Deactivate my account"
                />
                <Button
                  color="failure"
                  id="deactivate"
                  size="xs"
                  onClick={() => setDeactivate(true)}
                >
                  <p className="text-sm xxl:!text-lg">Deactivate</p>
                </Button>
              </div>
            </>
          )}
        </div>
        <Footer variant={1}>
          <CustomButton
            size="sm"
            disabled={!isDirty}
            className="mt-3 w-full sm:!w-fit"
            type="submit"
          >
            <p className="xxl:!text-lg">Save changes</p>
          </CustomButton>
        </Footer>
      </form>
      <Modal
        show={deactivate}
        position="top-center"
        className="font-Poppins"
        onClose={closeModal}
      >
        <Modal.Header>Deactivate my account</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <p className="font-semibold xxl:!text-xl">
                Are you sure, you want to deactivate your account?
              </p>
              <span className="text-xs xxl:!text-lg text-gray-500">
                By deactivating your account, you need to know:
              </span>
              <ol className="text-xs xxl:!text-lg list-disc ml-10 text-gray-500">
                <li> All of your future appointments will be cancelled</li>
                <li>
                  You can always come back, just by login into your account
                </li>
              </ol>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="ml-auto" color="failure" onClick={handleOperation}>
            <p className="xxl:!text-lg">Yes</p>
          </Button>
          <Button className="ml-auto" color="gray" onClick={closeModal}>
            <p className="xxl:!text-lg">Close</p>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GeneralSettings;
