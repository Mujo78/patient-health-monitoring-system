import React, { useEffect, useState } from "react";
import Header from "../../../components/UI/Header";
import Footer from "../../../components/UI/Footer";
import {
  Button,
  Label,
  Modal,
  Spinner,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
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
      if (typeof action.payload === "object") {
        toast.success("Account successfully updated");
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
      dispatch(deactivateAccount(data));
      setDeactivate(false);
      dispatch(logout());
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header text="General settings" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full"
      >
        <div className="h-full py-5 flex flex-col gap-4">
          {status === "loading" ? (
            <div className="mx-auto my-auto justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div>
                <p className="flex justify-between">
                  <span className="text-blue-700 font-semibold">Patient</span>
                  <span className="font-bold">
                    {accessUser?.info.first_name +
                      " " +
                      accessUser?.info.last_name}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs" htmlFor="email" value="Your email" />
                <div className="flex flex-col w-3/5">
                  <TextInput
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
                    className="text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center mt-3 justify-between">
                <Label
                  className="text-xs"
                  htmlFor="notification"
                  value="Email notifications"
                />
                <Controller
                  control={control}
                  name="notification"
                  render={({ field: { value, onChange } }) => (
                    <ToggleSwitch
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
                  className="text-xs"
                  htmlFor="deactivate"
                  value="Deactivate my account"
                />
                <Button
                  color="failure"
                  id="deactivate"
                  size="xs"
                  onClick={() => setDeactivate(true)}
                >
                  Deactivate
                </Button>
              </div>
            </>
          )}
        </div>
        <Footer variant={1}>
          <CustomButton
            size="sm"
            disabled={!isDirty}
            className="mt-3"
            type="submit"
          >
            Save changes
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
              <p className="font-semibold">
                Are you sure, you want to deactivate your account?
              </p>
              <span className="text-xs text-gray-500">
                By deactivating your account, you need to know:
              </span>
              <ol className="text-xs list-disc ml-10 text-gray-500">
                <li> All of your future appointments will be cancelled</li>
                <li>
                  {" "}
                  You can always come back, just by login into your account
                </li>
              </ol>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleOperation}>
            Yes
          </Button>
          <Button color="gray" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GeneralSettings;
