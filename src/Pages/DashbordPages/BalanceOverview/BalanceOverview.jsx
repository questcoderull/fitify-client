import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaMoneyBillWave, FaUserTie } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import ChartSubscribersVsMembers from "./ChartSubscribersVsMembers";
import { Helmet } from "react-helmet-async";

const BalanceOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["admin-balance-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/balance-overview");
      return res.data;
    },
  });

  const { totalBalance, lastPayments = [] } = data;

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-600">
        Loading financial overview...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <Helmet>
        <title>Fitify | Dashboard | Balance</title>
      </Helmet>
      <h2 className="text-3xl font-bold text-primary mb-10 text-center flex items-center justify-center gap-2">
        <MdOutlinePayments className="text-4xl text-primary" />
        Admin Financial Dashboard
      </h2>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 shadow-lg rounded-xl p-6 flex items-center gap-6 mb-12">
        <FaMoneyBillWave className="text-5xl text-blue-700" />
        <div>
          <p className="text-lg text-gray-700">Total Balance Collected</p>
          <p className="text-3xl font-bold text-blue-800">${totalBalance}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BsClockHistory className="text-xl text-primary" />
          Last 6 Payment Transactions
        </h3>

        <div className="overflow-x-auto border rounded-xl shadow-md">
          <table className="table w-full text-sm">
            <thead className="bg-primary text-white text-[15px]">
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Class</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Payment Time</th>
              </tr>
            </thead>
            <tbody>
              {lastPayments.map((payment, index) => (
                <tr
                  key={payment._id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="font-medium">{index + 1}</td>
                  <td className="flex items-center gap-2 py-2">
                    {payment.memberImage ? (
                      <img
                        src={payment.memberImage}
                        alt={payment.memberName}
                        className="w-9 h-9 rounded-full border"
                      />
                    ) : (
                      <BiUserCircle className="text-3xl text-gray-500" />
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {payment.memberName}
                    </span>
                  </td>
                  <td className="text-gray-600 font-medium">
                    {payment.classTitle}
                  </td>
                  <td className="text-green-600 font-semibold">
                    ${payment.amountPaid}
                  </td>
                  <td className="text-xs text-gray-500">
                    {payment.transactionId}
                  </td>
                  <td className="text-gray-700">
                    {new Date(payment.paymentTime).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie Chart Placeholder */}
      <div className="mt-16 border border-primary rounded-2xl p-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUserTie className="text-xl text-primary" />
          Subscribers vs Paid Members
        </h3>
        <ChartSubscribersVsMembers />
      </div>
    </div>
  );
};

export default BalanceOverview;
