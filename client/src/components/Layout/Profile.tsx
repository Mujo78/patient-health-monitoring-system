import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { authUser, updatePicture } from "../../features/auth/authSlice";
import CustomImg from "../UI/CustomImg";
import { HiOutlineCamera } from "react-icons/hi2";
import { Outlet } from "react-router-dom";
import CustomButton from "../UI/CustomButton";
import { useAppDispatch } from "../../app/hooks";
import { formatDate } from "../../service/appointmentSideFunctions";
import ProfileLayout from "./ProfileLayout";

type Props = {
  children: React.ReactNode;
};

const Profile: React.FC<Props> = ({ children }) => {
  const [selectedImg, setSelectedImg] = useState<File>();
  const [img, setImg] = useState("");
  const [show, setShow] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { accessUser, status } = useSelector(authUser, shallowEqual);

  useEffect(() => {
    let objectURL: string;
    if (selectedImg) {
      objectURL = URL.createObjectURL(selectedImg);
      setImg(objectURL);
      setShow(true);
    }

    return () => URL.revokeObjectURL(objectURL);
  }, [selectedImg]);

  const updateProfilePicture = () => {
    if (selectedImg) {
      dispatch(updatePicture(selectedImg));
    }
  };

  useEffect(() => {
    if (status === "idle") {
      setShow(false);
    }
  }, [status]);

  return (
    <ProfileLayout>
      <Card className="relative z-10 h-fit w-11/12 lg:!h-full lg:!max-w-xs xl:!mt-24 xxl:mb-auto xxl:!h-2/3 xxl:!max-w-sm">
        <div className="flex h-full w-full flex-wrap gap-6">
          <div className="mx-auto flex md:!h-fit lg:!h-1/4 xl:!h-auto">
            <div className="relative mx-auto flex flex-grow items-start justify-center rounded-lg">
              {selectedImg ? (
                <img
                  src={img}
                  className="h-28 w-28 md:!my-auto md:!w-48 lg:!w-28 xl:!w-fit xxl:!h-56 xxl:!w-56"
                />
              ) : (
                <CustomImg
                  url={accessUser?.data.photo}
                  className="w-26 h-auto md:!my-auto md:!w-48 lg:!w-28 xl:!w-32 xxl:!w-56"
                />
              )}
              <div className="absolute bottom-0 right-0 size-9">
                <label
                  htmlFor="inputFile"
                  className="flex cursor-pointer items-center justify-center rounded-full border-2 border-blue-700 bg-blue-700 p-1.5"
                >
                  <HiOutlineCamera className="size-5 text-white" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="inputFile"
                  name="selectedImg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImg(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
            <hr className="md:!hidden lg:!block" />
          </div>
          <div className="flex w-full flex-grow flex-col gap-6 divide-y md:!w-fit lg:!h-[70%] lg:!w-full xxl:!h-[65%]">
            <p className="break-words text-center text-xs font-semibold xxl:!text-lg">
              {accessUser?.data.email}
            </p>
            <ul>{children}</ul>
            <div>
              <p className="mt-1 text-sm xxl:!text-lg">Joined</p>
              <p className="text-md text-center xxl:!text-xl">
                {formatDate(accessUser?.data.createdAt as Date)}
              </p>
            </div>
            <CustomButton
              className={`mt-auto ${!show ? "hidden" : "flex"}`}
              onClick={updateProfilePicture}
            >
              <p className="xxl:!text-lg">Save changes</p>
            </CustomButton>
          </div>
        </div>
      </Card>
      <Card className="relative z-10 h-fit w-11/12 lg:!h-full lg:!w-2/4  xl:!mt-24 xxl:mb-auto xxl:!h-2/3">
        <Outlet />
      </Card>
    </ProfileLayout>
  );
};

export default Profile;
