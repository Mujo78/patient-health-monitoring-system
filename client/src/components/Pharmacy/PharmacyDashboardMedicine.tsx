import React from "react";
import { PharmacyDashboardInfoType } from "../../service/pharmacySideFunctions";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import NoDataAvailable from "../UI/NoDataAvailable";

type Props = {
  data: PharmacyDashboardInfoType | undefined;
};

const COLORS = ["#15803d", "#22c55e", "#86efac", "#dcfce7", "#d1d5db"];

const PharmacyDashboardMedicine: React.FC<Props> = ({ data }) => {
  return (
    <>
      {data ? (
        <>
          <Card className="h-96 w-full xl:!h-full xl:!w-2/5">
            {data?.topExpensive?.length > 0 ? (
              <>
                <p className="text-sm xxl:!text-xl">
                  The most expensive medicine
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    className="text-xs xxl:!text-lg"
                    width={500}
                    height={300}
                    data={data.topExpensive}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 5,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" barSize={10} fill="#15803d" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <NoDataAvailable />
            )}
          </Card>
          <div className="mb-20 flex h-fit w-full flex-wrap gap-3 sm:!mb-3 lg:!w-fit lg:!flex-grow lg:!gap-6 lg:pb-3 xl:!mb-0 xl:!h-full xl:!w-2/5 xl:!pb-0">
            <Card className="mx-auto flex-grow lg:!max-w-sm xl:!h-full xl:!max-w-sm">
              {data?.usedMedicine?.length > 0 ? (
                <div className="mb-auto flex flex-col justify-start gap-4">
                  <p className="xxl:!text-xl">The most used medicine</p>
                  <div className="divide-y divide-green-500">
                    {data?.usedMedicine?.map((m) => (
                      <Link
                        to={`/medicine?id=${m._id}`}
                        className="flex w-full cursor-pointer p-3 hover:bg-gray-100"
                        key={m._id}
                      >
                        <div className="flex w-full items-center justify-between text-sm xxl:!text-lg">
                          <p>{m.name}</p>
                          <p className="ml-auto">{m.value}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NoDataAvailable />
              )}
            </Card>
            <Card className="h-96 w-full lg:!w-fit lg:!flex-grow xl:!h-full xl:!max-w-lg">
              {data?.data?.length > 0 ? (
                <>
                  <p className="text-sm xxl:!text-xl">Top categories</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={300} height={200} className="xxl:!text-lg">
                      <Pie
                        dataKey="value"
                        data={data.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={87}
                        paddingAngle={6}
                        fill="#8884d8"
                        label
                      >
                        {data.data?.map((_entry, index) => (
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
                </>
              ) : (
                <NoDataAvailable />
              )}
            </Card>
          </div>
        </>
      ) : (
        <Card className="mb-20 w-full p-3 sm:!mb-3 md:!p-12 xl:!h-full">
          <Link to={"/add-medicine"}>
            <div className="flex w-full flex-col gap-4 text-center text-gray-400">
              <p className="text-md xxl:!text-xl">
                There are no medicines in database!
              </p>
              <p className="text-xs xxl:!text-lg">
                Make sure to add medicines and see statistics
              </p>
            </div>
          </Link>
        </Card>
      )}
    </>
  );
};

export default PharmacyDashboardMedicine;
