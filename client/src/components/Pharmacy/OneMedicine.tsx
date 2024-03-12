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

const OneMedicine: React.FC = () => {
  const query = useQuery();
  const id = query.get("id");
  const dispatch = useAppDispatch();
  const { specificMedicine, message, status } = useSelector(medicine);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, control, reset } =
    useForm<MedicineType>({ resolver: yupResolver(medicineValidationSchema) });
  const { errors, isDirty } = formState;
  const [img, setImg] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<File | null>();
  const fileInputRef = useRef(null);

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
        photo: selectedImg ? selectedImg : newData.photo,
      };

      if (
        isDirty ||
        (selectedImg && selectedImg.name !== specificMedicine.photo)
      ) {
        dispatch(updateMedicineById({ id, data })).then((action) => {
          if (typeof action.payload === "object") {
            toast.success("Successfully updated medicine!");
            navigate("..");
          }
        });
      }
    }
  };

  const navigateBack = () => {
    navigate("/medicine", { replace: true });
  };
  return (
    <div className="lg:!overflow-auto w-full h-full" id="content">
      {id && specificMedicine ? (
        <div className="overflow-hidden">
          <div className="h-4">
            <HiXMark
              onClick={navigateBack}
              className="ml-auto my-3 transition-all duration-300 w-6 h-auto cursor-pointer hover:scale-125"
            />
          </div>
          {img ? (
            <img src={img} className="mx-auto mb-4 w-24 mt-2 md:!w-52 h-auto" />
          ) : (
            <CustomMedicineImg
              url={
                specificMedicine?.photo?.startsWith(specificMedicine.name)
                  ? `http://localhost:3001/uploads/${specificMedicine.photo}`
                  : specificMedicine.photo
              }
              className="mx-auto w-24 mt-3 md:!w-52 h-auto"
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex w-full h-full overflow-y-auto flex-col px-4 items-center pb-16 md:!pb-2 "
          >
            <div className=" flex text-xs gap-3 flex-col w-full justify-center">
              <div className="flex-grow">
                <Input
                  value="Name"
                  id="name"
                  className="mt-1"
                  {...register("name")}
                  type="text"
                  color={errors.name && "failure"}
                  error={errors.name}
                />
              </div>
              <div className="w-full">
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
              <div className="w-full">
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
              <div className="flex-grow">
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
              <div className="relative w-full flex flex-col gap-1">
                <div>
                  <Input
                    value="Photo URL (optional)"
                    id="photo"
                    className="mt-1"
                    {...register("photo")}
                    type="text"
                    placeholder="Enter image URL"
                    color={errors.photo && "failure"}
                  />
                </div>

                <p className="text-center">OR</p>
                <div className="flex-grow">
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
              </div>
              <div className="w-full">
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
              <div>
                <div className="w-full mx-auto">
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
                </div>
              </div>
            </div>
            <Footer variant={1}>
              <CustomButton type="submit" className="w-full">
                Save
              </CustomButton>
            </Footer>
          </form>
        </div>
      ) : (
        id &&
        status === "failed" && (
          <div className="text-center mt-14">
            <ErrorMessage text={message} className="text-md xxl:!text-xl" />
          </div>
        )
      )}
    </div>
  );
};

export default OneMedicine;
