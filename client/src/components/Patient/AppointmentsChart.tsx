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
import moment from "moment";
import NoDataAvailable from "../UI/NoDataAvailable";
import CustomSpinner from "../UI/CustomSpinner";
import useAPI from "../../hooks/useAPI";

type dataAppointments = {
  name: string;
  visited: number;
};

type Props = {
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  error: string | undefined;
};

const AppointmentsChart: React.FC<Props> = ({ setError, error }) => {
  const [month, setMonth] = useState<string>(moment().format("MMMM"));

  const {
    data: dataApps,
    loading,
    error: appError,
  } = useAPI<dataAppointments[]>(`/appointment/per-month/${month}`);

  useEffect(() => {
    if (!error) setError(appError);
  }, [error, appError, setError]);

  const onHandleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(event.target.value);
  };

  return (
    <Card className="flex h-96 w-full flex-col xl:!h-2/4">
      {loading ? (
        <CustomSpinner />
      ) : dataApps && dataApps?.length > 0 ? (
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
                {moment.months().map((month) => (
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
