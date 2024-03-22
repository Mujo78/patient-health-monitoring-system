import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const [selectedImg, setSelectedImg] = useState<File>();
  const [img, setImg] = useState("");
  const [show, setShow] = useState<boolean>(true);

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
      dispatch(updatePicture(selectedImg)).then(() => {
        setShow(false);
      });
    }
  };

  return (
    <ProfileLayout>
      <Card className="w-11/12 lg:!max-w-xs xl:!mt-24 h-fit lg:!h-full xxl:!h-2/3 xxl:mb-auto xxl:!max-w-sm relative z-10">
        <div className="flex h-full w-full gap-6 flex-wrap">
          <div className="flex md:!h-fit lg:!h-1/4 xl:!h-auto mx-auto">
            <div className="relative flex-grow flex justify-center items-start rounded-lg mx-auto">
              {selectedImg ? (
                <img
                  src={img}
                  className="w-28 md:!w-48 lg:!w-28 xxl:!w-56 xl:!w-fit h-auto md:!my-auto"
                />
              ) : (
                <CustomImg
                  url={accessUser?.data.photo}
                  className="w-26 md:!w-48 lg:!w-28 xxl:!w-56 xl:!w-32 h-auto md:!my-auto"
                />
              )}
              <div className="absolute bottom-0 right-0 size-9">
                <label
                  htmlFor="inputFile"
                  className="bg-blue-700 flex justify-center items-center p-1.5 rounded-full border-2 border-blue-700 cursor-pointer"
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
          <div className="w-full md:!w-fit lg:!w-full lg:!h-[70%] xxl:!h-[65%] flex-grow flex flex-col gap-6 divide-y">
            <p className="text-xs xxl:!text-lg text-center font-semibold break-words">
              {accessUser?.data.email}
            </p>
            <ul>{children}</ul>
            <div>
              <p className="text-sm xxl:!text-lg mt-1">Joined</p>
              <p className="text-center text-md xxl:!text-xl">
                {formatDate(accessUser?.data.createdAt as Date)}
              </p>
            </div>
            <CustomButton
              className="mt-auto"
              disabled={img === "" && !show}
              onClick={updateProfilePicture}
            >
              <p className="xxl:!text-lg">Save changes</p>
            </CustomButton>
          </div>
        </div>
      </Card>
      <Card className="w-11/12 lg:!w-2/4 h-fit lg:!h-full xxl:!h-2/3 xxl:mb-auto  xl:!mt-24 relative z-10">
        <Outlet />
      </Card>
    </ProfileLayout>
  );
};

export default Profile;
