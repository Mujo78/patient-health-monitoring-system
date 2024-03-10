import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  CartesianGrid,
  Bar,
  YAxis,
  XAxis,
} from "recharts";
import { Card } from "flowbite-react";
import {
  GenderArray,
  appointmentsByDay,
} from "../../service/departmentSideFunctions";

const COLORS = ["#2986cc", "#c90076", "#cccccc"];

type Props = {
  appointmentsByDay: appointmentsByDay[];
  gender: GenderArray[];
};

const DepartmentAppointmentStatistics: React.FC<Props> = ({
  appointmentsByDay,
  gender,
}) => {
  return (
    <div className="w-full flex xxl:!h-2/4 h-fit flex-wrap mt-auto xxl:!text-lg xl:!flex-nowrap gap-4 pb-20 md:pb-0">
      <Card className="w-full h-96 xxl:!h-auto xxl:p-2 xl:!w-3/4 text-xs xxl:!text-lg">
        <p>Num. of appointments for next 7 days</p>
        <ResponsiveContainer width="100%" height="100%" className="!p-0">
          <BarChart
            width={500}
            height={300}
            data={appointmentsByDay}
            margin={{
              top: 0,
              left: -35,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" barSize={10} fill="#1d4ed8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card className="w-full h-96 xxl:!h-auto xl:!w-1/4">
        {gender.every((d) => d.value === 0) ? (
          <p className="text-center text-sm text-gray-400">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <PieChart
              width={100}
              height={100}
              margin={{
                top: 0,
                left: -25,
              }}
            >
              <Pie
                data={gender}
                cx="50%"
                cy="50%"
                label
                animationDuration={500}
                labelLine={false}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {gender.map((_entry, index) => (
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
    </div>
  );
};

export default DepartmentAppointmentStatistics;
