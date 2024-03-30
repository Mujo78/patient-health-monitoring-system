import React, { useEffect, useState } from "react";
import { Select, Card, Label } from "flowbite-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { numberOfAppointmentsPerMonthForDepartments } from "../../service/appointmentSideFunctions";

import moment from "moment";
import NoDataAvailable from "../UI/NoDataAvailable";
import CustomSpinner from "../UI/CustomSpinner";

type dataAppointments = {
  name: string;
  visited: number;
};

type Props = {
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const AppointmentsChart: React.FC<Props> = ({ setError }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [month, setMonth] = useState<string>(moment().format("MMMM"));
  const [dataApps, setDataApps] = useState<dataAppointments[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response =
          await numberOfAppointmentsPerMonthForDepartments(month);
        setDataApps(response);
      } catch (err: any) {
        setError(err.message);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, setError]);

  const onHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(event.target.value);
  };

  return (
    <Card className="flex h-96 w-full flex-col xl:!h-2/4">
      {loading ? (
        <CustomSpinner />
      ) : dataApps.length > 0 ? (
        <>
          <div className="flex items-center">
            <p className="text-xs font-semibold xxl:!text-lg">
              Year: {new Date().getFullYear()}
            </p>
            <div className="ml-auto flex items-center gap-5">
              <Label htmlFor="month" className="hidden lg:block xxl:!text-lg">
                Choose a month:
              </Label>
              <Select
                id="month"
                sizing="sm xxl:lg"
                name="month"
                value={month}
                onChange={onHandleChange}
              >
                {moment.monthsShort().map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <ResponsiveContainer width="95%" height="80%" className="mx-auto">
            <BarChart
              width={200}
              height={200}
              data={dataApps}
              layout="vertical"
              margin={{ left: 30 }}
            >
              <CartesianGrid horizontal={false} vertical={true} />
              <Tooltip />
              <XAxis
                className="xxl:!text-xl"
                type="number"
                dataKey="visited"
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              />
              <YAxis
                dataKey="name"
                type="category"
                className="text-xs xxl:!text-lg"
                tickSize={4}
              />
              <Legend />
              <Bar dataKey="visited" barSize={16} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <NoDataAvailable />
      )}
    </Card>
  );
};

export default AppointmentsChart;
