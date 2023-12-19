import React, { useEffect, useState } from "react";
import {
  getDepartments,
  getDoctorsForDepartment,
  Department,
} from "../../../service/departmentSideFunctions";
import { Spinner, Table } from "flowbite-react";
import CustomButton from "../../../components/UI/CustomButton";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi2";
import CustomImg from "../../../components/UI/CustomImg";
import { UserInfo } from "../../../features/appointment/appointmentSlice";
import Footer from "../../../components/Footer";
import { useSelector } from "react-redux";
import { authUser } from "../../../features/auth/authSlice";
import ErrorMessage from "../../../components/UI/ErrorMessage";

export type Doctor = {
  _id: string;
  address: string;
  bio: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  qualification: string;
  speciality: string;
  user_id: UserInfo;
  available_days: string[];
};
const AppointmentDepartment: React.FC = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDep, setSelectedDep] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);

  const { accessUser } = useSelector(authUser);
  const [res, setRes] = useState<Department[] | null>();
  const [doc, setDoc] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await getDepartments(accessUser.token);
          setRes(response);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  const chooseDepartment = (name: string) => {
    setSelectedDoc("");
    setSelectedDep(name);
    const fetchData = async () => {
      if (name && accessUser) {
        try {
          setLoadingDoc(true);
          const response = await getDoctorsForDepartment(
            accessUser.token,
            name
          );
          setDoc(response);
        } finally {
          setLoadingDoc(false);
        }
      }
    };
    fetchData();
  };

  const handleNavigate = () => {
    navigate(`${selectedDoc}`, { replace: true });
  };

  return (
    <>
      {doctorId ? (
        <Outlet />
      ) : res !== null ? (
        <div className=" flex flex-col h-full px-3">
          <div className="flex justify-between flex-wrap flex-grow">
            <div className=" overflow-y-auto">
              <h1 className="text-3xl font-semibold py-4">Departments</h1>
              <p className="text-sm text-gray-600">
                Please choose department for appointment. Make sure to choose
                only one department!
              </p>
              <div className="flex w-full justify-center mt-2">
                {loading ? (
                  <Spinner />
                ) : (
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Name</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {res &&
                        res.length > 0 &&
                        res.map((n) => (
                          <Table.Row
                            onClick={() => chooseDepartment(n.name)}
                            key={n._id}
                            className={`bg-white cursor-pointer dark:border-gray-700 ${
                              selectedDep === n.name && "bg-blue-200"
                            } dark:bg-gray-800`}
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {n.name}
                            </Table.Cell>
                            <Table.Cell className="text-[9px]">
                              {n.description.slice(
                                0,
                                n.description.indexOf(".")
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <HiChevronRight />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table>
                )}
              </div>
            </div>
            <div className="mt-2 mb-2 w-2/5">
              {loadingDoc ? (
                <div className="mx-auto flex justify-center mt-4">
                  {" "}
                  <Spinner />{" "}
                </div>
              ) : (
                <Table className="w-4/5 flex flex-col justify-center">
                  <Table.Body className="divide-y">
                    {doc.length > 0 &&
                      doc.map((n) => (
                        <Table.Row
                          key={n._id}
                          className={`${
                            selectedDoc === n._id && "bg-blue-200"
                          } flex gap-3 justify-start text-center items-center w-full cursor-pointer`}
                          onClick={() => setSelectedDoc(n._id)}
                        >
                          <Table.Cell>
                            <CustomImg
                              url={n.user_id.photo}
                              className="w-[60px] h-[60px] rounded-full"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <h1 className="font-bold text-md">
                              {"Dr. " + n.first_name + " " + n.last_name}
                            </h1>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
          <Footer variant={1}>
            <CustomButton
              disabled={selectedDoc === ""}
              onClick={handleNavigate}
              size="md"
              className="ml-auto mr-3 my-3"
            >
              Continue
            </CustomButton>
          </Footer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <ErrorMessage
            text="There was an error, please try again later!"
            size="md"
          />
        </div>
      )}
    </>
  );
};

export default AppointmentDepartment;
