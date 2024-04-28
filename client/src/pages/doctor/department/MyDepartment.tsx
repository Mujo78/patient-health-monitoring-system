import React from "react";
import {
  myDepartmentAppointments,
  myDepartmentResult,
} from "../../../service/departmentSideFunctions";
import { Tabs } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import useSelectedPage from "../../../hooks/useSelectedPage";
import DepartmentStatistics from "../../../components/Department/DepartmentStatistics";
import DepartmentAppointmentStatistics from "../../../components/Department/DepartmentAppointmentStatistics";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Header from "../../../components/UI/Header";
import DoctorDepartmentTable from "../../../components/Doctor/DoctorDepartmentTable";
import useAPI from "../../../hooks/useAPI";
import { tabItemTheme } from "../../../service/appointmentSideFunctions";

const MyDepartment: React.FC = () => {
  const {
    data: department,
    loading,
    error,
  } = useAPI<myDepartmentResult>("/department/my-department");

  const {
    data: departmentAppointments,
    loading: loadingAppointments,
    error: appointmentsError,
  } = useAPI<myDepartmentAppointments>(
    "/department/my-department-appointments",
  );

  useSelectedPage("My department");

  return (
    <div className="duration-900 h-full w-full transition-all">
      {loading ? (
        <CustomSpinner size="lg" />
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <ErrorMessage text={error} />
        </div>
      ) : (
        department && (
          <div className="h-full w-full">
            <div className="mt-5 flex h-full w-full flex-grow flex-col gap-3 px-2 lg:!mt-0 lg:flex-row lg:!gap-2 lg:!divide-x lg:pt-2">
              <div className="flex w-full flex-col gap-3 lg:!w-2/5">
                <Header size={2} text={department?.department?.name} />
                <Tabs.Group
                  aria-label="Default tabs"
                  theme={tabItemTheme}
                  style="underline"
                >
                  <Tabs.Item active title="Active">
                    <DoctorDepartmentTable
                      data={department.todayActiveDoctors}
                    />
                  </Tabs.Item>
                  <Tabs.Item title="Other">
                    <DoctorDepartmentTable data={department.otherDoctors} />
                  </Tabs.Item>
                </Tabs.Group>
              </div>
              <div className="flex h-full w-full flex-col justify-start gap-4 lg:!w-3/5 lg:!gap-0 lg:!py-3 lg:!pl-3">
                <p className="text-justify text-sm xxl:!text-xl">
                  We are delighted to welcome you to the{" "}
                  {department?.department.name} Department, where excellence in
                  healthcare is our commitment. As you embark on your journey
                  with us, we want to ensure you have all the essential
                  information at your fingertips to navigate your department
                  effectively.Thank you for your dedication to our mission of
                  providing exceptional healthcare to our community. Together,
                  we will continue to make a positive impact on the lives of our
                  patients.
                </p>

                {loadingAppointments ? (
                  <CustomSpinner />
                ) : departmentAppointments ? (
                  <>
                    <DepartmentStatistics
                      numOfDoctors={department?.numberOfDoctors}
                      numOfActiveDoctors={department.numberOfActiveDoctors}
                      todayAppointment={
                        departmentAppointments?.todayAppointment
                      }
                    />

                    <DepartmentAppointmentStatistics
                      gender={department.gender}
                      appointmentsByDay={
                        departmentAppointments.appointmentsByDay
                      }
                    />
                  </>
                ) : (
                  appointmentsError && (
                    <div className="flex h-full items-center justify-center">
                      <ErrorMessage text={appointmentsError} />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MyDepartment;
