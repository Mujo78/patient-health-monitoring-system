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
import { DocDashboardType } from "../../../service/appointmentSideFunctions";
import moment from "moment";

const cx = 150;
const cy = 130;
const iR = 50;
const oR = 85;

const COLORS = ["#1d4ed8", "#F5B843", "#D4DCFF"];

type Props = {
  docDashInfo: DocDashboardType;
};

const DocDashboard: React.FC<Props> = ({ docDashInfo }) => {
  const currentMonth = moment().format("MMMM");

  return (
    <>
      {docDashInfo ? (
        <>
          <div className="flex justify-around">
            <div className="flex flex-col gap-4">
              {docDashInfo.apps.map((n) => (
                <Card key={n.name}>
                  <div>
                    <p>
                      {n.name} - {n.value}
                    </p>
                  </div>
                </Card>
              ))}
              <Card
                className="cursor-pointer text-blue-700 flex items-center"
                href="/appointments"
              >
                See more {"->"}
              </Card>
            </div>
            <Card>
              <div className="h-full flex flex-col gap-5">
                <p>Avg. age of patients</p>
                <p>
                  Month: <span className="font-semibold"> {currentMonth} </span>
                </p>
                <p className="text-5xl mx-auto font-normal text-blue-600 my-auto">
                  {docDashInfo.averageAge}
                </p>
              </div>
            </Card>
          </div>
          <Card className="w-full h-2/4">
            <div className="flex flex-col gap-0 h-full w-full">
              <p>
                Year:{" "}
                <span className="font-semibold">
                  {new Date().getFullYear()}
                </span>
              </p>
              {docDashInfo.patientStatistic[0].value !== 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={500}>
                    <Pie
                      className="cursor-pointer"
                      dataKey="value"
                      startAngle={-360}
                      endAngle={0}
                      data={docDashInfo?.patientStatistic}
                      cx={cx}
                      cy={cy}
                      innerRadius={iR}
                      outerRadius={oR}
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
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
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
            </div>
          </Card>
        </>
      ) : (
        <div>Nothing</div>
      )}
    </>
  );
};

export default DocDashboard;
