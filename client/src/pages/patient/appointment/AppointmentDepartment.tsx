import React, { useEffect, useState } from "react";
import {
  getDoctorsForDepartment,
  Department,
  DoctorType,
} from "../../../service/departmentSideFunctions";
import { Table } from "flowbite-react";
import CustomButton from "../../../components/UI/CustomButton";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi2";
import CustomImg from "../../../components/UI/CustomImg";
import Footer from "../../../components/UI/Footer";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import toast from "react-hot-toast";
import Header from "../../../components/UI/Header";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import useAPI from "../../../hooks/useAPI";

const AppointmentDepartment: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<DoctorType[]>();

  const { doctorId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    error,
    setError,
    data: departments,
  } = useAPI<Department[] | null>("/department/", {
    conditions: !doctorId,
    checkData: true,
  });

  useEffect(() => {
    if (error)
      toast.error(
        "Something went wrong while getting departments data, please try again later!",
      );
  }, [error]);

  const chooseDepartment = async (name: string) => {
    setSelectedDoctor("");
    setSelectedDepartment(name);

    if (name) {
      try {
        setLoadingDoc(true);
        const response = await getDoctorsForDepartment(name);
        setDoctors(response);
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      } finally {
        setLoadingDoc(false);
      }
    }
  };

  const handleNavigate = () => {
    navigate(`${selectedDoctor}`, { replace: true });
  };

  const handleClick = (id: string) => {
    setSelectedDoctor(id);
  };

  return (
    <>
      {doctorId ? (
        <Outlet />
      ) : loading ? (
        <CustomSpinner />
      ) : departments && departments.length > 0 ? (
        <div className=" flex h-full flex-col px-3">
          <div className="mt-2 flex flex-grow flex-wrap justify-between gap-8 xl:!flex-nowrap">
            <div className="w-full xl:!flex-grow">
              <Header text="Departments" size={3} position="start" />
              <p className="my-2 text-sm text-gray-600 xxl:!text-lg">
                Please choose department for appointment. Make sure to choose
                only one department!
              </p>
              <div className="flex w-full justify-center">
                <Table hoverable>
                  <Table.Head className="xxl:!text-xl">
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Description</Table.HeadCell>
                    <Table.HeadCell className="hidden lg:!table-cell"></Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {departments.length > 0 &&
                      departments.map((n) => (
                        <Table.Row
                          onClick={() => chooseDepartment(n.name)}
                          key={n._id}
                          className={`cursor-pointer bg-white dark:border-gray-700 ${
                            selectedDepartment === n.name && "bg-blue-200 "
                          } dark:bg-gray-800`}
                        >
                          <Table.Cell className="whitespace-nowrap  font-medium text-gray-900 dark:text-white xxl:!text-xl">
                            {n.name}
                          </Table.Cell>
                          <Table.Cell className="text-[0.8rem] xxl:!text-lg">
                            <p
                              className={`${selectedDepartment === n.name && "text-gray-600"} line-clamp-1 `}
                            >
                              {n.description}
                            </p>
                          </Table.Cell>
                          <Table.Cell className="hidden lg:!table-cell">
                            <HiChevronRight />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
            <div className="w-full xl:!flex-grow">
              {loadingDoc ? (
                <CustomSpinner fromTop={4} />
              ) : selectedDepartment && doctors ? (
                <>
                  <Header text="Doctors" size={3} position="start" />
                  <p className="pb-2 text-sm text-gray-600 xxl:!text-lg">
                    Please choose doctor from{" "}
                    <strong>{selectedDepartment}</strong> department.
                  </p>
                  {doctors.length > 0 ? (
                    <Table className="flex w-full flex-col justify-center xl:!w-4/5">
                      <Table.Body className="divide-y">
                        {doctors.map((n) => (
                          <Table.Row
                            key={n._id}
                            className={`${
                              selectedDoctor === n._id &&
                              "bg-blue-200 !text-gray-950"
                            } flex w-full cursor-pointer items-center justify-start gap-3 text-center`}
                            onClick={() => handleClick(n._id)}
                          >
                            <Table.Cell>
                              <CustomImg
                                url={n.user_id.photo}
                                className="h-auto w-16 rounded-full xxl:!w-24"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <h1 className="text-md font-bold xxl:!text-xl">
                                {"Dr. " + n.first_name + " " + n.last_name}
                              </h1>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <NoDataAvailable />
                  )}
                </>
              ) : (
                error && (
                  <div className="my-auto flex h-full items-center justify-center text-center">
                    <ErrorMessage text={error} />
                  </div>
                )
              )}
            </div>
          </div>
          <Footer variant={1}>
            <CustomButton
              disabled={selectedDoctor === ""}
              onClick={handleNavigate}
              size="md"
              className="mb-16 mt-2 w-full md:mb-2 lg:!my-3 lg:!w-fit xl:mb-0"
            >
              <p className="xxl:text-lg">Continue</p>
            </CustomButton>
          </Footer>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <ErrorMessage text={error} />
        </div>
      ) : (
        !error &&
        !loading && (
          <div className="flex h-full w-full items-center justify-center">
            <NoDataAvailable />
          </div>
        )
      )}
    </>
  );
};

export default AppointmentDepartment;
