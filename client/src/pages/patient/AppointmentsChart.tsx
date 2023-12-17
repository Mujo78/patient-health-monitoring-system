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
    <Card className="w-full h-2/4 flex flex-col ">
      <div className="flex items-center">
        <p className="text-sm font-semibold">
          Year: {new Date().getFullYear()}
        </p>
        <div className="flex gap-5 items-center ml-auto">
          <Label htmlFor="month">Choose a month:</Label>
          <Select
            id="month"
            sizing="sm"
            name="month"
            onSelect={handleSelect}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="January"> January </option>
            <option value="February"> February </option>
            <option value="March"> March </option>
            <option value="April"> April </option>
            <option value="May"> May </option>
            <option value="June"> June </option>
            <option value="July"> July </option>
            <option value="August"> August </option>
            <option value="September"> September </option>
            <option value="October"> October </option>
            <option value="November"> November </option>
            <option value="December"> December </option>
          </Select>
        </div>
      </div>
      <ResponsiveContainer width="90%" height="80%" className="mx-auto">
        <BarChart width={200} height={200} data={dataApps} layout="vertical">
          <CartesianGrid horizontal={false} vertical={true} />
          <Tooltip />
          <XAxis
            type="number"
            dataKey="visited"
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 9 }}
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
