import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getMedicineById,
  medicine,
  resetSpecificMedicine,
  updateMedicineById,
} from "../../features/medicine/medicineSlice";
import { useAppDispatch } from "../../app/hooks";
import ErrorMessage from "../UI/ErrorMessage";
import CustomMedicineImg from "./CustomMedicineImg";
import { HiXMark } from "react-icons/hi2";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  MedicineType,
  medicineValidationSchema,
} from "../../validations/medicineValidation";
import { Label, Select, Textarea, ToggleSwitch } from "flowbite-react";
import Footer from "../UI/Footer";
import CustomButton from "../UI/CustomButton";
import toast from "react-hot-toast";
import Input from "../UI/Input";
import { useQuery } from "../../hooks/useQuery";
import FormRow from "../UI/FormRow";
import { categories } from "../../validations/pharmacyValidation";
import { isFulfilled } from "@reduxjs/toolkit";

const OneMedicine: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>();
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const query = useQuery();
  const id = query.get("id");
  const { register, handleSubmit, formState, control, reset } =
    useForm<MedicineType>({ resolver: yupResolver(medicineValidationSchema) });
  const { errors, isDirty } = formState;

  const dispatch = useAppDispatch();
  const { specificMedicine, message, status } = useSelector(medicine);

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

  useEffect(() => {
    if (id) {
      setSelectedImg(null);
      setImg("");
      dispatch(getMedicineById(id));
    }

    return () => {
      dispatch(resetSpecificMedicine());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (specificMedicine) {
      reset(specificMedicine);
    }
  }, [specificMedicine, reset]);

  const onSubmit = (newData: MedicineType) => {
    if (id && specificMedicine) {
      const data = {
        ...newData,
        _id: id,
        pharmacy_id: specificMedicine.pharmacy_id,
        photo: selectedImg ?? newData.photo,
      };

      if (
        isDirty ||
        (selectedImg && selectedImg.name !== specificMedicine.photo)
      ) {
        dispatch(updateMedicineById({ id, data })).then((action) => {
          if (isFulfilled(action)) {
            toast.success("Successfully updated medicine!");
            navigate("/medicine");
          }
        });
      }
    }
  };

  const navigateBack = () => {
    navigate("/medicine", { replace: true });
  };

  return (
    <div className="h-full w-full lg:!overflow-auto" id="content">
      {id && specificMedicine ? (
        <div className="overflow-hidden ">
          <div className="h-4">
            <HiXMark
              onClick={navigateBack}
              className="my-3 ml-auto h-auto w-6 cursor-pointer transition-all duration-300 hover:scale-125"
            />
          </div>
          {img ? (
            <img src={img} className="mx-auto mb-4 mt-2 h-auto w-24 md:!w-52" />
          ) : (
            <CustomMedicineImg
              url={
                specificMedicine?.photo?.startsWith(specificMedicine.name)
                  ? `http://localhost:3001/uploads/${specificMedicine.photo}`
                  : specificMedicine.photo
              }
              className="mx-auto mt-3 h-auto w-24 md:!w-52"
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex h-full w-full flex-col items-center overflow-y-auto px-4 pb-16 sm:!pb-2 "
          >
            <div className=" flex w-full flex-col justify-center gap-3 text-xs">
              <FormRow>
                <Input
                  autoComplete="true"
                  label="Name"
                  id="name"
                  className="mt-1"
                  {...register("name")}
                  type="text"
                  color={errors.name && "failure"}
                  error={errors.name}
                />
              </FormRow>
              <FormRow>
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
              <FormRow>
                <>
                  <Label
                    htmlFor="category"
                    className="text-sm"
                    value="Category"
                  />
                  <Select
                    id="category"
                    className="mt-1"
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
              </FormRow>
              <FormRow>
                <Input
                  label="Price"
                  id="price"
                  className="mt-1"
                  {...register("price")}
                  type="number"
                  color={errors.price && "failure"}
                  error={errors.price}
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Manufacturer"
                  id="manufacturer"
                  className="mt-1"
                  {...register("manufacturer")}
                  type="text"
                  color={errors.manufacturer && "failure"}
                  error={errors.manufacturer}
                />
              </FormRow>
              <div className="relative flex w-full flex-col gap-1">
                <div>
                  <Input
                    label="Photo URL (optional)"
                    id="photo"
                    className="mt-1"
                    {...register("photo")}
                    type="text"
                    placeholder="Enter image URL"
                    color={errors.photo && "failure"}
                  />
                </div>

                <p className="text-center xxl:text-xl">OR</p>
                <div className="flex-grow">
                  <label
                    className={`block w-full cursor-pointer bg-white p-2.5 xxl:text-xl ${
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
              </div>
              <FormRow>
                <>
                  <Label
                    htmlFor="description"
                    className="text-sm"
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
                      status === "failed" && <ErrorMessage text={message} />
                    )}
                  </div>
                </>
              </FormRow>
              <FormRow>
                <>
                  <Controller
                    control={control}
                    name="available"
                    render={({ field: { value, onChange } }) => (
                      <ToggleSwitch
                        label="Available now?"
                        color="success"
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <ErrorMessage text={errors.available?.message} />
                </>
              </FormRow>
            </div>
            <Footer variant={1}>
              <CustomButton type="submit" className="w-full">
                <p className="xxl:text-xl">Save</p>
              </CustomButton>
            </Footer>
          </form>
        </div>
      ) : (
        id &&
        message && (
          <div className="mt-14 text-center">
            <ErrorMessage text={message} />
          </div>
        )
      )}
    </div>
  );
};

export default OneMedicine;
