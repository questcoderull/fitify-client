import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const COLORS = ["#0ea5e9", "#22c55e"]; // blue, green

const ChartSubscribersVsMembers = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["subscribers-vs-paid"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/subscriber-vs-paid");
      return res.data;
    },
  });

  const chartData = [
    { name: "Subscribers", value: data.subscribersCount || 0 },
    { name: "Paid Members", value: data.paidMembersCount || 0 },
  ];

  if (isLoading) {
    return <p className="text-center mt-5">Loading chart...</p>;
  }

  return (
    <div className="w-full md:w-[500px] mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSubscribersVsMembers;
