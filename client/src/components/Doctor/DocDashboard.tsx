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
import Header from "../UI/Header";
import NoDataAvailable from "../UI/NoDataAvailable";

const COLORS = ["#1d4ed8", "#F5B843", "#D4DCFF"];

type Props = {
  docDashInfo: DocDashboardType | undefined;
};

const DocDashboard: React.FC<Props> = ({ docDashInfo }) => {
  const currentMonth = moment().format("MMMM");

  return (
    <div className="flex h-full w-full flex-col justify-between gap-3">
      <div className="flex w-full flex-col flex-wrap justify-center gap-3 lg:!flex-row xl:!my-auto xl:!flex-row">
        <div className="flex flex-grow flex-wrap gap-4 text-sm lg:!flex-col xl:!text-lg xxl:!text-xl">
          {docDashInfo?.apps !== undefined &&
            docDashInfo?.apps.map((n) => (
              <Card key={n.name} className="flex-grow">
                <p className="text-center text-sm xxl:!text-lg">
                  {n.name} - {n.value}
                </p>
              </Card>
            ))}
          <Card
            className={`${!docDashInfo?.apps && "!h-full"} mt-auto flex h-fit w-full cursor-pointer items-center text-center text-sm text-blue-700 xxl:!text-lg`}
            href="/appointments"
          >
            See more {"->"}
          </Card>
        </div>
        <Card className="flex-grow">
          <div className="flex h-full flex-col gap-12 text-sm md:!flex-row lg:!flex-col">
            <div className="flex flex-col gap-3 text-sm md:!gap-4 xxl:!text-lg">
              Avg. age of patients
              <p>
                Month:
                <span className="font-semibold"> {currentMonth} </span>
              </p>
            </div>

            {docDashInfo?.averageAge ? (
              <Header
                className="!mx-auto !mt-auto text-blue-600"
                text={docDashInfo?.averageAge.toString()}
                size={4}
              />
            ) : (
              <NoDataAvailable />
            )}
          </div>
        </Card>
      </div>

      <Card className="h-96 w-full xl:!h-2/4">
        <p className="mb-auto text-sm xxl:!text-lg">
          Year:{" "}
          <span className="font-semibold">{new Date().getFullYear()} </span>
        </p>
        {docDashInfo?.patientStatistic &&
        docDashInfo?.patientStatistic?.length > 0 ? (
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
              <Legend align="right" layout="vertical" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <NoDataAvailable className="mb-auto" />
        )}
      </Card>
    </div>
  );
};

export default DocDashboard;
