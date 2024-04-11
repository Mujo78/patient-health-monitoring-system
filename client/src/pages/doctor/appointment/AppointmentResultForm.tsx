import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  appointment,
  makeAppointmentFinished,
} from "../../../features/appointment/appointmentSlice";
import { useAppDispatch } from "../../../app/hooks";
import {
  AppointmentFinished,
  getDateTime,
} from "../../../service/appointmentSideFunctions";
import socket from "../../../socket";
import { authUser } from "../../../features/auth/authSlice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Label, Textarea } from "flowbite-react";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import Select from "react-select";
import FormRow from "../../../components/UI/FormRow";
import Header from "../../../components/UI/Header";
import { Medicine } from "../../../features/medicine/medicineSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import CancelAppointmentButton from "../../../components/Appointment/CancelAppointmentButton";
import { getAllMedicine } from "../../../service/pharmacySideFunctions";

const AppointmentResultForm = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [medicineData, setMedicineData] = useState<Medicine[]>();
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { selectedAppointment: selected } = useSelector(
    appointment,
    shallowEqual,
  );

  const { register, getValues, formState, setValue } =
    useForm<AppointmentFinished>();
  const { isDirty } = formState;

  const { accessUser } = useSelector(authUser, shallowEqual);
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
        (action: any) => {
          if (isFulfilled(action)) {
            const selectedInfo = {
              _id: selected._id,
              app_date: getDateTime(selected.appointment_date),
              doctor_name:
                selected.doctor_id.first_name +
                " " +
                selected.doctor_id.last_name,
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
          } else {
            toast.error(action.payload);
          }
        },
      );
    }
  };

  const cancelAppointmentNow = () => {
    if (selected) {
      const selectedInfo = {
        app_date: getDateTime(selected.appointment_date),
        doctor_name:
          selected.doctor_id.first_name + " " + selected.doctor_id.last_name,
        doctor_spec: selected.doctor_id.speciality,
      };
      socket.emit(
        "appointment_cancel",
        selectedInfo,
        selected.patient_id.user_id._id,
        accessUser?.data.role,
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selected?.finished) {
          const response = await getAllMedicine();
          setMedicineData(response);
        }
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      }
    };

    fetchData();
  }, [selected?.finished]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = (value: readonly { value: string; label: string }[]) => {
    const newOnes = value.map((n) => n.value);
    setSelectedValues(newOnes);
  };

  const laterAppointment: boolean | undefined = selected
    ? new Date(selected?.appointment_date) > new Date()
    : undefined;

  const options = useMemo(() => {
    return medicineData?.map((n) => ({
      value: n._id,
      label: `${n.name + "(" + n.strength + ")"}`,
    }));
  }, [medicineData]);

  useEffect(() => {
    if (selected !== null) {
      setValue("description", selected.description);
      setValue("other_medicine", selected.other_medicine);
      setValue("diagnose", selected.diagnose);
    }
  }, [selected, setValue]);

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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Header size={1} text="Appointment result" />
              {!selected?.finished &&
                new Date() < new Date(selected.appointment_date) && (
                  <CancelAppointmentButton
                    variant="text"
                    id={selected._id}
                    thenFn={cancelAppointmentNow}
                  />
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
