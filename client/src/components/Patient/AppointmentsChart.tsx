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
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import moment from "moment";

type dataAppointments = {
  name: string;
  visited: number;
};

const AppointmentsChart: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  const [month, setMonth] = useState<string>(moment().format("MMMM"));
  const [dataApps, setDataApps] = useState<dataAppointments[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (month && accessUser) {
        try {
          const response = await numberOfAppointmentsPerMonthForDepartments(
            accessUser.token,
            month
          );
          setDataApps(response);
        } catch (err: any) {
          console.log(err);
        }
      }
    };
    fetchData();
  }, [month, accessUser]);

  const handleSelect = async () => {
    if (month && accessUser) {
      try {
        const response = await numberOfAppointmentsPerMonthForDepartments(
          accessUser.token,
          month
        );
        setDataApps(response);
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  return (
    <Card className="w-full h-96 xl:!h-2/4 flex flex-col">
      <div className="flex items-center">
        <p className="text-xs xxl:!text-lg font-semibold">
          Year: {new Date().getFullYear()}
        </p>
        <div className="flex gap-5 items-center ml-auto">
          <Label htmlFor="month" className="hidden lg:block xxl:!text-lg">
            Choose a month:
          </Label>
          <Select
            id="month"
            sizing="sm xxl:lg"
            name="month"
            onSelect={handleSelect}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
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
    </Card>
  );
};

export default AppointmentsChart;
