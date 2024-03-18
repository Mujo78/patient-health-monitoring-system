import React from "react";
import {
  DocDashboardInfoType,
  formatDate,
  formatStartEnd,
} from "../../service/appointmentSideFunctions";
import { Card } from "flowbite-react";
import CustomImg from "../UI/CustomImg";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { yearCalc } from "../../service/personSideFunctions";

const COLORS = ["#2986cc", "#c90076", "#cccccc"];

type Props = {
  docDash: DocDashboardInfoType;
};
const DocDashboardInfo: React.FC<Props> = ({ docDash }) => {
  return (
    <>
      {docDash ? (
        <>
          <div className="flex gap-3 md:!flex-row xl:!flex-col flex-col xl:!items-center w-full flex-grow">
            <Card
              className="w-full xl:!max-w-md cursor-pointer"
              href="/my-department"
            >
              <div className="flex flex-col justify-start h-full xl:gap-6">
                <p className="text-sm xxl:!text-lg mb-auto">My department</p>
                <h1 className="text-xl xxl:!text-3xl font-bold mb-auto mx-auto">
                  {docDash?.department_name}
                </h1>
                <p className="text-xs xxl:!text-lg text-blue-700 ml-auto">
                  See more {"->"}
                </p>
              </div>
            </Card>
            <Card
              className="cursor-pointer w-full xl:!max-w-md xl:my-auto"
              href={
                docDash?.latest?._id && `/appointments/${docDash.latest._id}`
              }
            >
              {docDash.latest !== null ? (
                <div className="flex flex-wrap items-center gap-3">
                  <CustomImg
                    url={docDash.latest.patient_id?.user_id?.photo}
                    className="rounded-full mx-auto w-28 xxl:!w-40 h-auto"
                  />
                  <div className="flex flex-grow flex-col gap-0">
                    <h1 className="lg:!text-lg xl:!text-xl xxl:!text-2xl font-bold">
                      {docDash.latest?.patient_id.first_name +
                        " " +
                        docDash.latest.patient_id.last_name}
                    </h1>
                    <p className="ml-auto xxl:!text-lg">
                      Age: {yearCalc(docDash.latest.patient_id.date_of_birth)}
                    </p>
                    <div className="flex flex-wrap text-gray-400 gap-1 text-xs xxl:!text-lg xxl:!mx-auto">
                      <p>{formatDate(docDash.latest.appointment_date)}</p>
                      <p>({formatStartEnd(docDash.latest.appointment_date)})</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-400 text-sm">No data available</p>
                </div>
              )}
            </Card>
          </div>
          <Card className="h-72 w-full xl:!max-w-md xl:!h-2/5">
            {docDash?.gender.every((m) => m.value === 0) ? (
              <p className="text-center text-sm text-gray-400">
                No data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className="flex items-center">
                  <Pie
                    className="cursor-pointer transition-all duration-300"
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={docDash.gender}
                    innerRadius="50%"
                    outerRadius="70%"
                    cx="50%"
                    cy="80%"
                    label
                  >
                    {docDash.gender?.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </>
      ) : (
        <p>Nothing</p>
      )}
    </>
  );
};

export default DocDashboardInfo;
