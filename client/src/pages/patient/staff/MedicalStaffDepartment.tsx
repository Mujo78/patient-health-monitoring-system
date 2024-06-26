import React from "react";
import { DepartmentAllInfo } from "../../../service/departmentSideFunctions";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Card } from "flowbite-react";
import CustomImg from "../../../components/UI/CustomImg";
import { useParams, Link } from "react-router-dom";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Header from "../../../components/UI/Header";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import useAPI from "../../../hooks/useAPI";

const MedicalStaffDepartment: React.FC = () => {
  const { departmentName } = useParams();

  const {
    loading,
    error,
    data: selectedDepartment,
  } = useAPI<DepartmentAllInfo>(`/department/${departmentName}`, {
    conditions: departmentName,
  });

  return (
    <>
      {loading ? (
        <CustomSpinner size="md" />
      ) : selectedDepartment ? (
        <div className="flex flex-col gap-3 divide-y">
          <div className="flex flex-col  gap-3">
            <Header
              size={3}
              bold
              text={selectedDepartment?.department.name}
              position="start"
            />

            <p className="text-justify xl:!text-sm xxl:!text-2xl">
              {selectedDepartment?.department?.description}
            </p>
            <p className="xl:!text-md ml-0 lg:!ml-auto xxl:!text-2xl">
              Phone number:{" "}
              <Link
                to={`tel:${selectedDepartment?.department?.phone_number}`}
                className="text-blue-700"
              >
                +{selectedDepartment?.department?.phone_number}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap pb-14 md:!pb-0">
            {selectedDepartment?.doctors?.length > 0 ? (
              selectedDepartment?.doctors.map((d) => (
                <Card
                  key={d?._id}
                  className="m-3 w-full xl:!w-fit"
                  href={`/appointment/new/${d?._id}`}
                >
                  <div className="flex items-center gap-3">
                    <CustomImg
                      url={d?.user_id?.photo}
                      className=" h-auto w-10 rounded-full md:!w-14 xxl:!w-24"
                    />
                    <div className="w-full">
                      <p className="xxl:text-2xl">
                        Dr. {d?.first_name + " " + d?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 xxl:!text-lg">
                        {d?.qualification}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <NoDataAvailable className="w-full" />
            )}
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <ErrorMessage text={error} />
        </div>
      ) : (
        !selectedDepartment &&
        !error &&
        !loading && (
          <div className="flex h-full w-full items-center justify-center">
            <ErrorMessage text="You haven't selected any department" />
          </div>
        )
      )}
    </>
  );
};

export default MedicalStaffDepartment;
