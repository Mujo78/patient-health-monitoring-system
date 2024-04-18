import {
  Label,
  Select,
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
import { shallowEqual, useSelector } from "react-redux";
import {
  MedicineDataType,
  MedicineType,
  addNewMedicine,
  medicine,
} from "../../../features/medicine/medicineSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { medicineValidationSchema } from "../../../validations/medicineValidation";
import { useAppDispatch } from "../../../app/hooks";
import { toast } from "react-hot-toast";
import { HiXCircle } from "react-icons/hi2";
import useSelectedPage from "../../../hooks/useSelectedPage";
import { errorMessageConvert } from "../../../service/authSideFunctions";
import Input from "../../../components/UI/Input";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";
import { categories } from "../../../validations/pharmacyValidation";
import { isFulfilled } from "@reduxjs/toolkit";
import Header from "../../../components/UI/Header";

const AddMedicine: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>();
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState, control, reset } =
    useForm<MedicineType>({ resolver: yupResolver(medicineValidationSchema) });
  const { isDirty, errors } = formState;

  const dispatch = useAppDispatch();
  const { status, message } = useSelector(medicine, shallowEqual);

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
      photo: selectedImg ?? data.photo,
    };

    dispatch(addNewMedicine(newData)).then((action: any) => {
      if (isFulfilled(action)) {
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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full flex-grow flex-col justify-between">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="flex h-full w-full flex-col items-center"
        >
          {status === "loading" ? (
            <CustomSpinner />
          ) : (
            <div className="flex h-fit w-full flex-col gap-2 lg:!h-full lg:!px-8 xl:!w-3/4 xl:!px-16">
              <div className=" flex h-full flex-col justify-center px-3 lg:gap-3 xl:!gap-2 xxl:!gap-6">
                <Header text="Add new Medicine" size={2} />
                <FormRow over gap={4} className="flex-col md:flex-row">
                  <Input
                    autoComplete="true"
                    label="Name"
                    id="name"
                    className="mt-1"
                    {...register("name")}
                    type="text"
                    color={errors.name && "failure"}
                  >
                    <p className="text-xs text-red-600 xxl:!text-[1rem]">
                      {errors.name?.message
                        ? errors.name.message
                        : message?.includes("name")
                          ? errorMessageConvert(message, "name")
                          : ""}
                    </p>
                  </Input>

                  <Input
                    label="Strength (mg)"
                    id="strength"
                    className="mt-1"
                    {...register("strength")}
                    type="number"
                    max={3000}
                    min={1}
                    color={errors.strength && "failure"}
                    error={errors.strength}
                  />
                </FormRow>
                <FormRow over gap={4}>
                  <>
                    <Label
                      htmlFor="category"
                      className="text-sm xxl:!text-lg"
                      value="Category"
                    />
                    <Select
                      id="category"
                      className="mt-1 xxl:!text-lg"
                      {...register("category")}
                      color={errors.category && "failure"}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage text={errors.category?.message} />
                  </>

                  <Input
                    label="Price (BAM)"
                    id="price"
                    className="bg-black"
                    {...register("price")}
                    type="number"
                    color={errors.price && "failure"}
                    error={errors.price}
                  />
                </FormRow>

                <FormRow className="w-full flex-col lg:flex-row lg:!items-center">
                  <Input
                    label="Manufacturer"
                    id="manufacturer"
                    className="mt-1"
                    {...register("manufacturer")}
                    type="text"
                    color={errors.manufacturer && "failure"}
                    error={errors.manufacturer}
                  />
                  <div className="ml-auto flex w-full flex-col justify-center lg:!w-2/3">
                    <Controller
                      control={control}
                      name="available"
                      render={({ field: { value, onChange } }) => (
                        <ToggleSwitch
                          className="mb-2"
                          label="Available now?"
                          color="success"
                          checked={value}
                          onChange={onChange}
                        />
                      )}
                    />
                    <ErrorMessage text={errors.available?.message} />
                  </div>
                </FormRow>

                <div>
                  <Label
                    htmlFor="photo"
                    className="text-sm xxl:!text-lg"
                    value="Photo URL (optional)"
                  />
                  <div className="flex w-full flex-col flex-wrap items-center gap-4 lg:!flex-row">
                    <div className="relative w-full lg:!w-2/3">
                      <TextInput
                        id="photo"
                        className="mt-1 w-full"
                        disabled={
                          img && selectedImg !== undefined ? true : false
                        }
                        {...register("photo")}
                        type="text"
                        placeholder="Enter image URL"
                        color={errors.photo && "failure"}
                      />
                    </div>
                    <p className="px-3 text-center xxl:!text-lg">OR</p>
                    <Tooltip
                      style="light"
                      animation="duration-1000"
                      placement="top"
                      content={
                        selectedImg && img ? (
                          <div>
                            <HiXCircle
                              className="ml-auto mt-1 h-auto w-5 cursor-pointer text-red-600 hover:scale-125 hover:transition-all hover:duration-300 xxl:!w-8"
                              onClick={handleDelete}
                            />
                            <img
                              src={img}
                              className="h-auto w-44 xxl:!w-56"
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
                          className={`xl:!text-md block w-full cursor-pointer bg-white p-2 text-sm xxl:!text-lg ${
                            errors.photo
                              ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                              : "border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                          }  rounded-xl border-2 text-center`}
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
                <FormRow>
                  <>
                    <Label
                      htmlFor="description"
                      className="text-sm xxl:!text-lg"
                      value="Description"
                    />
                    <Textarea
                      id="description"
                      {...register("description")}
                      color={errors.description && "failure"}
                      rows={5}
                      className="mt-1 text-xs"
                    />
                    <div className="mt-1 h-6">
                      {errors.description ? (
                        <ErrorMessage text={errors.description?.message} />
                      ) : (
                        status === "failed" && (
                          <ErrorMessage text={message} className="mt-2" />
                        )
                      )}
                    </div>
                  </>
                </FormRow>
              </div>
            </div>
          )}
          <Footer variant={1} className="mt-5 pb-14 sm:!pb-0">
            <CustomButton
              type="submit"
              className="m-3"
              disabled={!isDirty || status === "loading"}
            >
              <p className="xxl:text-lg">Save</p>
            </CustomButton>
          </Footer>
        </form>
      </div>
      <div className="hidden h-full w-1/6 bg-photo-second-vertical lg:flex" />
    </div>
  );
};

export default AddMedicine;
