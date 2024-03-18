import { Card } from "flowbite-react";
import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DocDashboardType } from "../../service/appointmentSideFunctions";
import moment from "moment";

const COLORS = ["#1d4ed8", "#F5B843", "#D4DCFF"];

type Props = {
  docDashInfo: DocDashboardType;
};

const DocDashboard: React.FC<Props> = ({ docDashInfo }) => {
  const currentMonth = moment().format("MMMM");

  return (
    <>
      {docDashInfo && (
        <div className="w-full h-full flex flex-col justify-between gap-3">
          <div className="flex flex-col lg:!flex-row xl:!my-auto xl:!flex-row flex-wrap gap-3 w-full justify-center">
            <div className="flex flex-grow flex-wrap lg:!flex-col gap-4 text-sm xl:!text-lg xxl:!text-xl">
              {docDashInfo.apps.map((n) => (
                <Card key={n.name} className="flex-grow">
                  <div>
                    <p className="text-center text-sm xxl:!text-lg">
                      {n.name} - {n.value}
                    </p>
                  </div>
                </Card>
              ))}
              <Card
                className="cursor-pointer text-center text-sm xxl:!text-lg text-blue-700 flex w-full items-center"
                href="/appointments"
              >
                See more {"->"}
              </Card>
            </div>
            <Card className="flex-grow">
              <div className="h-full flex flex-col md:!flex-row lg:!flex-col text-sm gap-5">
                <div className="flex text-sm xxl:!text-lg flex-col gap-3 md:!gap-4">
                  <p>Avg. age of patients</p>
                  <p>
                    Month:{" "}
                    <span className="font-semibold"> {currentMonth} </span>
                  </p>
                </div>
                <p className="text-3xl xxl:!text-5xl mx-auto font-normal text-blue-600 my-auto">
                  {docDashInfo.averageAge}
                </p>
              </div>
            </Card>
          </div>

          <Card className="w-full h-96 xl:!h-2/4">
            <p className="text-sm xxl:!text-lg">
              Year:{" "}
              <span className="font-semibold">{new Date().getFullYear()}</span>
            </p>
            {docDashInfo.patientStatistic[0].value !== 0 ? (
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    className="cursor-pointer"
                    dataKey="value"
                    startAngle={-360}
                    endAngle={0}
                    data={docDashInfo?.patientStatistic}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={87}
                    paddingAngle={6}
                    fill="#8884d8"
                    stroke="none"
                    label
                  >
                    {docDashInfo?.patientStatistic.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    align="right"
                    layout="vertical"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-gray-400">
                  You still don't have any patients.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default DocDashboard;
