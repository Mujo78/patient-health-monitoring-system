import React, { useEffect, useState } from "react";
import {
  Department,
  getDepartments,
} from "../../../service/departmentSideFunctions";
import { useSelector } from "react-redux";
import { authUser } from "../../../features/auth/authSlice";
import { Table } from "flowbite-react";
import { HiChevronRight } from "react-icons/hi2";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const MedicalStaff: React.FC = () => {
  const navigate = useNavigate();
  const { departmentName } = useParams();
  const [departments, setDepartments] = useState<Department[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser);

  useSelectedPage("Medical staff");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await getDepartments(accessUser.token);
          setDepartments(response);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  const chooseDepartment = (name: string) => {
    navigate(name);
  };

  return (
    <div className="h-full w-full">
      {loading ? (
        <CustomSpinner size="xl" />
      ) : departments !== undefined && departments?.length > 0 ? (
        <div className="flex flex-wrap lg:!flex-nowrap gap-3 lg:!gap-0 h-full w-full lg:!divide-x">
          <div className="w-full lg:!w-1/3">
            <p className="m-4 text-2xl xxl:!text-3xl font-semibold">
              Select a department
            </p>
            <hr className="hidden lg:!block" />
            <div className="px-3 mt-2">
              <Table>
                <Table.Body className="divide-y">
                  {departments &&
                    departments.map((n) => (
                      <Table.Row
                        onClick={() => chooseDepartment(n.name)}
                        key={n._id}
                        className={`bg-white cursor-pointer dark:border-gray-700 ${
                          departmentName === n.name && "bg-blue-200"
                        } dark:bg-gray-800`}
                      >
                        <Table.Cell className="whitespace-nowrap text-center lg:!text-start xxl:!text-2xl font-medium text-gray-900 dark:text-white">
                          {n.name}
                        </Table.Cell>
                        <Table.Cell className="hidden lg:!table-cell">
                          <HiChevronRight className="ml-auto" />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div
            className={`${
              departmentName ? "h-full" : "h-fit lg:!h-full"
            } w-full p-4`}
          >
            {departmentName ? (
              <Outlet />
            ) : (
              <div className="w-full h-full flex justify-center lg:!items-center items-start">
                <ErrorMessage
                  text="You haven't selected any department"
                  size="sm"
                  className="lg:!text-md xxl:!text-3xl"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-md xxl:!text-3xl text-gray-400">
            No data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalStaff;
