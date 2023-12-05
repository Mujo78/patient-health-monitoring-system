import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authUser } from "../../../features/auth/authSlice";
import {
  DepartmentAllInfo,
  getDepartmentAllInfo,
} from "../../../service/departmentSideFunctions";
import { HiOutlineXMark } from "react-icons/hi2";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Card, Spinner } from "flowbite-react";
import CustomImg from "../../../components/UI/CustomImg";
import { useParams, Link, useNavigate } from "react-router-dom";

const MedicalStaffDepartment: React.FC = () => {
  const { departmentName } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    DepartmentAllInfo | undefined
  >();
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser && departmentName) {
          const response = await getDepartmentAllInfo(
            accessUser.token,
            departmentName
          );
          setSelectedDepartment(response);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser, departmentName]);

  const hideChoosenDepartment = () => {
    navigate("/staff");
    setSelectedDepartment(undefined);
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner size="md" />
        </div>
      ) : selectedDepartment ? (
        <div className="divide-y flex flex-col gap-3">
          <div className="flex  flex-col">
            <div className="flex justify-between">
              <p className="text-3xl font-bold">
                {selectedDepartment.department.name}
              </p>
              <HiOutlineXMark
                onClick={hideChoosenDepartment}
                className="cursor-pointer w-[30px] h-[30px]"
              />
            </div>
            <p className="mt-3 text-justify">
              {" "}
              {selectedDepartment.department.description}
            </p>
            <p className="ml-auto">
              Phone number:{" "}
              <Link
                to={`tel:${selectedDepartment.department.phone_number}`}
                className="text-blue-700"
              >
                {" "}
                +{selectedDepartment.department.phone_number}
              </Link>
            </p>
          </div>
          <div className="flex">
            {selectedDepartment.doctors?.length > 0 &&
            typeof selectedDepartment.doctors !== "string" ? (
              selectedDepartment.doctors.map((d) => (
                <Card
                  key={d._id}
                  className="m-3"
                  href={`/appointment/new/${d._id}`}
                >
                  <div className="flex items-center gap-3">
                    <CustomImg
                      url={d.user_id.photo}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                    <div className="w-full">
                      <p>Dr. {d.first_name + " " + d.last_name}</p>
                      <p className="text-xs text-gray-500">{d.qualification}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <ErrorMessage text={selectedDepartment.doctors as string} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <ErrorMessage text="You haven't selected any department" size="md" />
        </div>
      )}
    </>
  );
};

export default MedicalStaffDepartment;
