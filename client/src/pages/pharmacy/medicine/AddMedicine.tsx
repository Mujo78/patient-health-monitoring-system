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
import CustomSpinner from "../../../components/UI/CustomSpinner";
import FormRow from "../../../components/UI/FormRow";
import { categories } from "../../../validations/pharmacyValidation";

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
      <div className="flex-grow flex-col flex h-full justify-between">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="flex w-full h-full flex-col items-center"
        >
          {status === "loading" ? (
            <CustomSpinner />
          ) : (
            <div className="h-fit lg:!h-full w-full lg:!px-8 xl:!px-16 xl:!w-3/4 flex flex-col gap-2">
              <div className=" flex lg:gap-3 flex-col h-full px-3 justify-center xl:!gap-2 xxl:!gap-6">
                <h1 className="text-2xl xxl:!text-3xl font-semibold mt-2 text-center">
                  Add new medicine
                </h1>
                <FormRow over gap={4} className="flex-col md:flex-row">
                  <Input
                    autoComplete="true"
                    value="Name"
                    id="name"
                    className="mt-1"
                    {...register("name")}
                    type="text"
                    color={errors.name && "failure"}
                  >
                    <p className="text-red-600 text-xs xxl:!text-[1rem]">
                      {errors.name?.message
                        ? errors.name.message
                        : message.includes("name")
                        ? errorMessageConvert(message, "name")
                        : ""}
                    </p>
                  </Input>

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
                    value="Price (BAM)"
                    id="price"
                    className="bg-black"
                    {...register("price")}
                    type="number"
                    color={errors.price && "failure"}
                    error={errors.price}
                  />
                </FormRow>

                <FormRow className="lg:!items-center flex-col lg:flex-row w-full">
                  <Input
                    value="Manufacturer"
                    id="manufacturer"
                    className="mt-1"
                    {...register("manufacturer")}
                    type="text"
                    color={errors.manufacturer && "failure"}
                    error={errors.manufacturer}
                  />
                  <div className="ml-auto flex justify-center flex-col w-full lg:!w-2/3">
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
                  <div className="flex flex-wrap flex-col lg:!flex-row gap-4 w-full items-center">
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
                              className="text-red-600 ml-auto h-auto w-5 xxl:!w-8 cursor-pointer hover:scale-125 mt-1 hover:transition-all hover:duration-300"
                              onClick={handleDelete}
                            />
                            <img
                              src={img}
                              className="w-44 xxl:!w-56 h-auto"
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
                          className={`block text-sm w-full xl:!text-md xxl:!text-lg bg-white p-2 cursor-pointer ${
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
                      className="text-xs mt-1"
                    />
                    <div className="h-6 mt-1">
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
          <Footer variant={1} className="pb-14 sm:!pb-0 mt-5">
            <CustomButton
              type="submit"
              className="m-3"
              disabled={!isDirty || status === "loading"}
            >
              <p className="xxl:text-xl">Save</p>
            </CustomButton>
          </Footer>
        </form>
      </div>
      <div className="bg-photo-second-vertical hidden lg:flex w-1/6 h-full" />
    </div>
  );
};

export default AddMedicine;
