import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import {
  getMyDepartment,
  getMyDepartmentAppointments,
  myDepartmentAppointments,
  myDepartmentResult,
} from "../../service/departmentSideFunctions";
import { Table, Tabs } from "flowbite-react";
import CustomImg from "../../components/UI/CustomImg";
import ErrorMessage from "../../components/UI/ErrorMessage";
import useSelectedPage from "../../hooks/useSelectedPage";
import DepartmentStatistics from "../../components/Department/DepartmentStatistics";
import DepartmentAppointmentStatistics from "../../components/Department/DepartmentAppointmentStatistics";
import CustomSpinner from "../../components/UI/CustomSpinner";

const MyDepartment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser);
  const [response, setResponse] = useState<myDepartmentResult>();
  const [departmentAppointments, setDepartmentAppointments] =
    useState<myDepartmentAppointments>();
  const [badResponse, setBadResponse] = useState<string | unknown>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await getMyDepartment(accessUser.token);
          setResponse(response);
        }
      } catch (err: any) {
        setBadResponse(err?.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await getMyDepartmentAppointments(accessUser.token);
          setDepartmentAppointments(response);
        }
      } catch (err: any) {
        setBadResponse(err?.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  useSelectedPage("My department");

  return (
    <div className="h-full w-full transition-all duration-900">
      {loading ? (
        <CustomSpinner size="lg" />
      ) : badResponse ? (
        <div className="flex justify-center items-center text-center mt-14 xxl:text-2xl">
          <ErrorMessage text={badResponse as string} size="md" />
        </div>
      ) : (
        <div className="h-full w-full">
          <div className="w-full h-full mt-5 lg:!mt-0 lg:pt-2 flex-grow px-2 lg:!divide-x flex flex-col lg:flex-row gap-3 lg:!gap-2">
            <div className="w-full flex flex-col gap-3 lg:!w-2/5">
              <h1 className="font-semibold text-2xl text-center">
                {response?.department.name}
              </h1>
              <Tabs.Group aria-label="Default tabs" style="default">
                <Tabs.Item active title="Active">
                  {response && response?.todayActiveDoctors.length > 0 ? (
                    <Table>
                      <Table.Body className="divide-y">
                        {response?.todayActiveDoctors.map((d) => (
                          <Table.Row key={d._id}>
                            <Table.Cell>
                              <CustomImg
                                url={d.user_id.photo}
                                className="rounded-full w-11 xxl:!w-20 h-auto"
                              />
                            </Table.Cell>
                            <Table.Cell className="font-semibold text-sm xxl:!text-xl text-gray-700">
                              {d.user_id._id === accessUser?.data._id ? (
                                <p>You</p>
                              ) : (
                                <p>Dr. {d.first_name + " " + d.last_name}</p>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p className="text-gray-400 text-sm text-center">
                      No data available.
                    </p>
                  )}
                </Tabs.Item>
                <Tabs.Item title="Other">
                  {response && response?.otherDoctors.length > 0 ? (
                    <Table className="h-full">
                      <Table.Body className="divide-y">
                        {response.otherDoctors.map((d) => (
                          <Table.Row key={d._id} className="bg-gray-100">
                            <Table.Cell>
                              <CustomImg
                                url={d.user_id.photo}
                                className="rounded-full w-11 xxl:!w-20 h-auto"
                              />
                            </Table.Cell>
                            <Table.Cell className="font-semibold text-md xxl:!text-xl text-gray-700">
                              {d.user_id._id === accessUser?.data._id ? (
                                <p>You</p>
                              ) : (
                                <p>Dr. {d.first_name + " " + d.last_name}</p>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">
                      No data available.
                    </p>
                  )}
                </Tabs.Item>
              </Tabs.Group>
            </div>
            <div className="w-full h-full flex flex-col lg:!w-3/5 gap-4 lg:!gap-0 lg:!py-3 lg:!pl-3 justify-start">
              <p className="text-sm xxl:!text-xl text-justify">
                We are delighted to welcome you to the{" "}
                {response?.department.name} Department, where excellence in
                healthcare is our commitment. As you embark on your journey with
                us, we want to ensure you have all the essential information at
                your fingertips to navigate your department effectively.Thank
                you for your dedication to our mission of providing exceptional
                healthcare to our community. Together, we will continue to make
                a positive impact on the lives of our patients.
              </p>

              {response && departmentAppointments && (
                <>
                  <DepartmentStatistics
                    numOfDoctors={response?.numberOfDoctors}
                    numOfActiveDoctors={response.numberOfActiveDoctors}
                    todayAppointment={departmentAppointments?.todayAppointment}
                  />

                  <DepartmentAppointmentStatistics
                    gender={response.gender}
                    appointmentsByDay={departmentAppointments.appointmentsByDay}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDepartment;
