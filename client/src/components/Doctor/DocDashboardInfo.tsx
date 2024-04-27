import React from "react";
import {
  DocDashboardInfoType,
  getDateTime,
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
import NoDataAvailable from "../UI/NoDataAvailable";

const COLORS = ["#2986cc", "#c90076", "#cccccc"];

type Props = {
  docDash: DocDashboardInfoType | undefined;
};
const DocDashboardInfo: React.FC<Props> = ({ docDash }) => {
  return (
    <>
      <div className="flex w-full flex-grow flex-col gap-3 md:!flex-row xl:!flex-col xl:!items-center">
        <Card
          className="w-full cursor-pointer xl:!max-w-md"
          href={docDash && "/my-department"}
        >
          <div className="flex h-full flex-col justify-start xl:gap-6">
            <p className="mb-auto text-sm xxl:!text-lg">My department</p>
            {docDash?.department_name ? (
              <>
                <p className="my-auto text-center text-xl font-bold xxl:!text-3xl">
                  {docDash.department_name}
                </p>
                <p className="ml-auto text-xs text-blue-700 xxl:!text-lg">
                  See more {"->"}
                </p>
              </>
            ) : (
              <NoDataAvailable />
            )}
          </div>
        </Card>
        <Card
          className="w-full cursor-pointer xl:my-auto xl:!max-w-md"
          href={docDash?.latest?._id && `/appointments/${docDash.latest._id}`}
        >
          {docDash && docDash?.latest ? (
            <div className="flex flex-wrap items-center gap-3">
              <CustomImg
                url={docDash.latest.patient_id?.user_id?.photo}
                className="mx-auto h-auto w-24 rounded-full xxl:!w-40"
              />
              <div className="flex flex-grow flex-col gap-0">
                <h1 className="font-bold lg:!text-lg xl:!text-xl xxl:!text-2xl">
                  {docDash.latest?.patient_id.first_name +
                    " " +
                    docDash.latest.patient_id.last_name}
                </h1>
                <p className="ml-auto xxl:!text-lg">
                  Age: {yearCalc(docDash.latest.patient_id.date_of_birth)}
                </p>
                <div className="flex flex-wrap gap-1 text-xs text-gray-600 xxl:!mx-auto xxl:!text-lg">
                  <p>{getDateTime(docDash?.latest?.appointment_date)}</p>
                </div>
              </div>
            </div>
          ) : (
            <NoDataAvailable />
          )}
        </Card>
      </div>
      <Card className="h-72 w-full xl:!h-2/5 xl:!max-w-md">
        {docDash?.gender &&
        docDash?.gender?.length > 0 &&
        docDash.gender.some((g) => g.value > 0) ? (
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
        ) : (
          <NoDataAvailable />
        )}
      </Card>
    </>
  );
};

export default DocDashboardInfo;
