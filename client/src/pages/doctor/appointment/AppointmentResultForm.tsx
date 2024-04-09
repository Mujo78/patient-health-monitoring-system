import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  appointment,
  cancelAppointment,
  makeAppointmentFinished,
} from "../../../features/appointment/appointmentSlice";
import { useAppDispatch } from "../../../app/hooks";
import {
  AppointmentFinished,
  formatDate,
  formatStartEnd,
} from "../../../service/appointmentSideFunctions";
import socket from "../../../socket";
import { authUser } from "../../../features/auth/authSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  getMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { HiXCircle } from "react-icons/hi2";
import { Label, Textarea } from "flowbite-react";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import Select from "react-select";
import FormRow from "../../../components/UI/FormRow";
import Header from "../../../components/UI/Header";

const AppointmentResultForm = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const navigate = useNavigate();
  const { selectedAppointment: selected } = useSelector(
    appointment,
    shallowEqual,
  );
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();

  const makeFinished = () => {
    const finishAppointment = {
      description: getValues().description,
      other_medicine: getValues().other_medicine,
      diagnose: getValues().diagnose,
      therapy: selectedValues,
      finished: true,
    };
    if (selected) {
      const id: string = selected._id;
      dispatch(makeAppointmentFinished({ id, finishAppointment })).then(
        (action) => {
          if (typeof action.payload === "object") {
            const selectedInfo = {
              _id: selected._id,
              app_date: `${formatDate(
                selected.appointment_date,
              )}, ${formatStartEnd(selected.appointment_date)}`,
              doctor_name: `${
                selected.doctor_id.first_name +
                " " +
                selected.doctor_id.last_name
              }`,
              doctor_spec: selected.doctor_id.speciality,
            };
            socket.emit(
              "appointment_finished",
              selectedInfo,
              selected.patient_id.user_id._id,
              accessUser?.data.role,
            );
            navigate("../", { replace: true });
            toast.success("Successfully finished appointment.");
          }
        },
      );
    }
  };

  const cancelAppointmentNow = () => {
    if (selected && accessUser) {
      dispatch(cancelAppointment(selected._id)).then((action) => {
        if (typeof action.payload === "object") {
          const selectedInfo = {
            app_date: `${formatDate(
              selected.appointment_date,
            )}, ${formatStartEnd(selected.appointment_date)}`,
            doctor_name: `${
              selected.doctor_id.first_name + " " + selected.doctor_id.last_name
            }`,
            doctor_spec: selected.doctor_id.speciality,
          };
          socket.emit(
            "appointment_cancel",
            selectedInfo,
            selected.patient_id.user_id._id,
            accessUser?.data.role,
          );
          navigate("../", { replace: true });
          toast.error("Appointment cancelled");
        }
      });
    }
  };

  const handleChange = (value: readonly { value: string; label: string }[]) => {
    const newOnes = value.map((n) => n.value);
    setSelectedValues(newOnes);
  };

  const laterAppointment: boolean | undefined = selected
    ? new Date(selected?.appointment_date) > new Date()
    : undefined;

  const { medicine: m } = useSelector(medicine);
  const { register, getValues, formState, setValue } =
    useForm<AppointmentFinished>();
  const { isDirty } = formState;

  const options = m?.data.map((n) => ({
    value: n._id,
    label: `${n.name + "(" + n.strength + ")"}`,
  }));

  useEffect(() => {
    if (selected) {
      setValue("description", selected.description);
      setValue("other_medicine", selected.other_medicine);
      setValue("diagnose", selected.diagnose);
    }
  }, [selected, setValue]);

  useEffect(() => {
    if (!selected?.finished && !laterAppointment) {
      dispatch(getMedicine({}));
    }
  }, [dispatch, selected, laterAppointment]);

  let ifIsFinished;
  if (selected?.therapy) {
    ifIsFinished = selected.therapy.map((t) => ({
      value: t._id,
      label: `${t.name + "(" + t.strength + ")"}`,
    }));
  }

  return (
    <>
      {selected !== null && (
        <div className="flex h-full w-full flex-col justify-center">
          <div className="flex h-full w-full flex-col gap-4 xl:!justify-center xxl:!h-3/4">
            <div className="flex items-center justify-between">
              <Header size={1} text="Appointment result" />
              {!selected?.finished &&
                new Date() < new Date(selected.appointment_date) && (
                  <button
                    className="h-auto w-16"
                    onClick={cancelAppointmentNow}
                  >
                    <HiXCircle className="ml-auto h-auto w-11 text-red-600 hover:!text-red-700 xxl:!w-16" />
                  </button>
                )}
            </div>
            <FormRow
              gap={3}
              className="flex-col lg:flex-row"
              fixed="w-full lg:!w-2/4"
            >
              <>
                <Label
                  htmlFor="diagnose"
                  className="mb-1 block xxl:!text-xl"
                  value="Diagnose"
                />
                <Textarea
                  id="diagnose"
                  {...register("diagnose")}
                  disabled={selected.finished || laterAppointment}
                  rows={selected.reason !== "" ? 5 : 7}
                  className="text-sm xxl:!text-lg"
                />
              </>

              <>
                <Label
                  htmlFor="therapy"
                  className="mb-1 block xxl:!text-xl"
                  value="Therapy"
                />
                <Select
                  options={options}
                  inputId="therapy"
                  defaultValue={ifIsFinished}
                  isDisabled={selected?.finished || laterAppointment}
                  className="mt-1 text-xs xxl:!text-lg"
                  isMulti
                  closeMenuOnSelect={false}
                  onChange={(value) => handleChange(value)}
                />
              </>
            </FormRow>
            <FormRow gap={4} className="flex-col lg:flex-row">
              <>
                <Label
                  htmlFor="other_medicine"
                  className="mb-1 block xxl:!text-xl"
                  value="Other medicine"
                />
                <Textarea
                  id="other_medicine"
                  {...register("other_medicine")}
                  disabled={selected?.finished || laterAppointment}
                  rows={selected.reason !== "" ? 5 : 7}
                  className="text-sm xxl:!text-lg"
                />
              </>
              <>
                <Label
                  htmlFor="description"
                  className="mb-1 block xxl:!text-xl"
                  value="Description"
                />
                <Textarea
                  id="description"
                  {...register("description")}
                  disabled={selected?.finished || laterAppointment}
                  rows={selected.reason !== "" ? 5 : 7}
                  className="text-sm xxl:!text-lg"
                />
              </>
            </FormRow>
          </div>
        </div>
      )}
      <div className="w-full pb-12 sm:!pb-0">
        <Footer variant={2}>
          {selected?.finished ||
            (!laterAppointment && (
              <CustomButton
                className="flex-grow lg:!flex-grow-0"
                disabled={!isDirty}
                onClick={makeFinished}
              >
                <p className="xxl:text-lg">Save changes</p>
              </CustomButton>
            ))}
        </Footer>
      </div>
    </>
  );
};

export default AppointmentResultForm;
