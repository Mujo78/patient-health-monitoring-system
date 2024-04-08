import React from "react";
import CustomImg from "../UI/CustomImg";
import { Table } from "flowbite-react";
import { DoctorType } from "../../service/departmentSideFunctions";

type Props = {
  data: DoctorType[];
};

const DoctorDepartmentTable: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data?.length > 0 ? (
        <Table className="h-full">
          <Table.Body className="divide-y">
            {data.map((doctor) => (
              <Table.Row key={doctor._id} className="bg-gray-100">
                <Table.Cell>
                  <CustomImg
                    url={doctor.user_id.photo}
                    className="h-auto w-11 rounded-full xxl:!w-20"
                  />
                </Table.Cell>
                <Table.Cell className="text-md font-semibold text-gray-700 xxl:!text-xl">
                  <p>Dr. {doctor.first_name + " " + doctor.last_name}</p>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="mt-6 text-center text-sm text-gray-400">
          No data available.
        </p>
      )}
    </>
  );
};

export default DoctorDepartmentTable;
