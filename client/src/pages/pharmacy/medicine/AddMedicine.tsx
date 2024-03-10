import {
  Label,
  Select,
  Spinner,
  TextInput,
  Textarea,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import Footer from "../../../components/UI/Footer";
import CustomButton from "../../../components/UI/CustomButton";
import { useSelector } from "react-redux";
import {
  MedicineDataType,
  addNewMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  MedicineType,
  medicineValidationSchema,
} from "../../../validations/medicineValidation";
import { useAppDispatch } from "../../../app/hooks";
import { toast } from "react-hot-toast";
import { HiXCircle } from "react-icons/hi2";
import useSelectedPage from "../../../hooks/useSelectedPage";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import Input from "../../../components/UI/Input";

const AddMedicine: React.FC = () => {
  const { status, message } = useSelector(medicine);
  const { register, handleSubmit, formState, control, reset } =
    useForm<MedicineType>({ resolver: yupResolver(medicineValidationSchema) });
  const { isDirty, errors } = formState;
  const [img, setImg] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>();
  const fileInputRef = useRef(null);
  const dispatch = useAppDispatch();

  useSelectedPage("Add medicine");

  useEffect(() => {
    let objectURL: string;
    if (selectedImg) {
      objectURL = URL.createObjectURL(selectedImg);
      setImg(objectURL);
    }

    return () => {
      URL.revokeObjectURL(objectURL);
    };
  }, [selectedImg]);

  const onSubmit = (data: MedicineType) => {
    const newData: MedicineDataType = {
      ...data,
      photo: selectedImg ? selectedImg : data.photo,
    };

    dispatch(addNewMedicine(newData)).then((action) => {
      if (typeof action.payload === "object") {
        toast.success("Successfully added new medicine!");
        setImg(null);
        setSelectedImg(null);
        reset();
      }
    });
  };

  const handleDelete = () => {
    setImg(null);
    setSelectedImg(null);
  };

  return (
    <div className="h-full flex justify-center items-center w-full">
      <div className="flex-grow flex-col flex h-full justify-between mr-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="flex w-full h-full flex-col items-center"
        >
          {status === "loading" ? (
            <div className="mx-auto my-auto">
              <Spinner />
            </div>
          ) : (
            <div className=" flex text-xs gap-3 flex-col w-1/2 h-full justify-center">
              <div className="w-full flex gap-4 mt-1">
                <div className="flex-grow">
                  <Input
                    value="Name"
                    id="name"
                    className="mt-1"
                    {...register("name")}
                    type="text"
                    color={errors.name && "failure"}
                  >
                    {errors.name?.message
                      ? errors.name.message
                      : message.includes("name")
                      ? errorMessageConvert(message, "name")
                      : ""}
                  </Input>
                </div>
                <div className="w-1/4">
                  <Input
                    value="Strength (mg)"
                    id="strength"
                    className="mt-1"
                    {...register("strength")}
                    type="number"
                    max={3000}
                    min={1}
                    color={errors.strength && "failure"}
                    error={errors.strength}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex-grow">
                  <Label
                    htmlFor="category"
                    className="text-sm"
                    value="Category"
                  />
                  <Select
                    id="category"
                    className="mt-2"
                    {...register("category")}
                    color={errors.category && "failure"}
                  >
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Antipyretics">Antipyretics</option>
                    <option value="Antacids">Antacids</option>
                    <option value="Antihistamines">Antihistamines</option>
                    <option value="Antidepressants">Antidepressants</option>
                    <option value="Anticoagulants">Anticoagulants</option>
                    <option value="Antidiabetics">Antidiabetics</option>
                    <option value="Antipsychotics">Antipsychotics</option>
                    <option value="Vaccines">Vaccines</option>
                    <option value="Other">Other</option>
                  </Select>
                  <ErrorMessage
                    text={errors.category?.message}
                    className="text-xs mt-1"
                  />
                </div>
                <div className="w-1/4">
                  <Input
                    value="Price"
                    id="price"
                    className="mt-1"
                    {...register("price")}
                    type="number"
                    color={errors.price && "failure"}
                    error={errors.price}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-5">
                <div className="flex-grow">
                  <Input
                    value="Manufacturer"
                    id="manufacturer"
                    className="mt-1"
                    {...register("manufacturer")}
                    type="text"
                    color={errors.manufacturer && "failure"}
                    error={errors.manufacturer}
                  />
                </div>
                <div className="w-1/3">
                  <Controller
                    control={control}
                    name="available"
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        className="mt-3"
                        label="Available now?"
                        color="success"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <ErrorMessage text={errors.available?.message} />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="photo"
                  className="text-xs"
                  value="Photo URL (optional)"
                />
                <div className="flex justify-between w-full items-center">
                  <div className="relative flex-grow w-2/3">
                    <TextInput
                      id="photo"
                      className="mt-1 w-full"
                      disabled={img && selectedImg !== undefined ? true : false}
                      {...register("photo")}
                      type="text"
                      placeholder="Enter image URL"
                      color={errors.photo && "failure"}
                    />
                  </div>
                  <p className="px-3">OR</p>
                  <Tooltip
                    style="light"
                    animation="duration-1000"
                    placement="right"
                    content={
                      selectedImg && img ? (
                        <div>
                          <HiXCircle
                            className="text-red-600 ml-auto h-[20px] w-[20px] cursor-pointer hover:w-[23px] hover:h-[23px] mt-1 hover:transition-all hover:duration-300"
                            onClick={handleDelete}
                          />
                          <img
                            src={img}
                            className="w-[180px]"
                            alt="Selected Image"
                          />
                        </div>
                      ) : (
                        ""
                      )
                    }
                    className="w-1/7"
                  >
                    <div className="w-full">
                      <label
                        className={`block w-full bg-white p-2.5 cursor-pointer ${
                          errors.photo
                            ? "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                            : "text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white"
                        }  border-2 rounded-xl text-center`}
                      >
                        {selectedImg ? "File selected" : "Choose file"}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          name="selectedImg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedImg(e.target.files[0]);
                            }

                            if (img === null || status === "idle") {
                              e.currentTarget.value = "";
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="description"
                  className="text-xs"
                  value="Description"
                />
                <Textarea
                  id="description"
                  {...register("description")}
                  color={errors.description && "failure"}
                  rows={5}
                  className="text-xs mt-1"
                />
                <div className="h-6 mt-1">
                  {errors.description ? (
                    <ErrorMessage
                      text={errors.description?.message}
                      className="text-xs"
                    />
                  ) : (
                    status === "failed" && (
                      <ErrorMessage text={message} className="text-xs" />
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          <Footer variant={1}>
            <CustomButton
              type="submit"
              className="m-3 "
              disabled={!isDirty || status === "loading"}
            >
              Save
            </CustomButton>
          </Footer>
        </form>
      </div>
      <div className="bg-photo-second-vertical w-1/6 h-full" />
    </div>
  );
};

export default AddMedicine;
