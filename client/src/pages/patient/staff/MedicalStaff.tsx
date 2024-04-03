import React, { useEffect, useState } from "react";
import {
  Department,
  getDepartments,
} from "../../../service/departmentSideFunctions";
import { Table } from "flowbite-react";
import { HiChevronRight } from "react-icons/hi2";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Header from "../../../components/UI/Header";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import toast from "react-hot-toast";

const MedicalStaff: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { departmentName } = useParams();

  useSelectedPage("Medical staff");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDepartments();
        setDepartments(response);
      } catch (error: any) {
        setError(true);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chooseDepartment = (name: string) => {
    navigate(name);
  };

  useEffect(() => {
    if (error) toast.error("There was an error, try again later!");
  }, [error]);

  useEffect(() => {
    if (departments && !departmentName) {
      navigate(departments[0]?.name);
    }
  }, [departments, navigate, departmentName]);

  return (
    <div className="h-full w-full">
      {loading ? (
        <CustomSpinner size="xl" />
      ) : departments && departments?.length > 0 ? (
        <div className="flex h-full w-full flex-wrap gap-3 lg:!flex-nowrap lg:!gap-0 lg:!divide-x">
          <div className="w-full lg:!w-1/3">
            <Header
              text="Select a department"
              position="start"
              size={2}
              className="m-4"
            />
            <hr className="hidden lg:!block" />
            <div className="mt-2 px-3">
              <Table>
                <Table.Body className="divide-y">
                  {departments &&
                    departments.map((n) => (
                      <Table.Row
                        onClick={() => chooseDepartment(n.name)}
                        key={n._id}
                        className={`cursor-pointer bg-white dark:border-gray-700 ${
                          departmentName === n.name && "bg-blue-200"
                        } dark:bg-gray-800`}
                      >
                        <Table.Cell className="whitespace-nowrap text-center font-medium text-gray-900 dark:text-white lg:!text-start xxl:!text-2xl">
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
              <div className="flex h-full w-full items-start justify-center lg:!items-center">
                <ErrorMessage text="You haven't selected any department" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoDataAvailable className="flex h-full items-center justify-center" />
      )}
    </div>
  );
};

export default MedicalStaff;
