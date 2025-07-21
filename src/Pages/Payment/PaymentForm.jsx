import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const { trainerId } = useParams();
  const [fee, setfee] = useState(0);
  const navigate = useNavigate();

  const feeInCents = fee * 100;
  console.log("fee in cence", feeInCents);

  const { isPending, data: trainerInfo = {} } = useQuery({
    queryKey: ["triners", trainerId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trainers/${trainerId}`);
      return res.data;
    },
  });

  // Getting query parameters from URL (example: ?day=Sunday&label=Evening&time=8:00%20PM)
  const searchParams = new URLSearchParams(location.search);
  const day = searchParams.get("day");
  const label = searchParams.get("label");
  const time = searchParams.get("time");
  const selectedPackage = searchParams.get("package");

  useEffect(() => {
    if (selectedPackage === "Basic") setfee(10);
    else if (selectedPackage === "Standard") setfee(50);
    else if (selectedPackage === "Premium") setfee(100);
  }, [selectedPackage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);

      //step 3. creating payment inten now.
      const res = await axiosSecure.post("create-payment-intent", {
        feeInCents,
        trainerId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        console.log(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          console.log(result);

          //   step 5. eikhane ja ja korar korbo. like mark as booked, or creating payment history. eikhane  slot book relete code hobe after a succefull payment.

          const bookingData = {
            trainerId,
            trainerName: trainerInfo.name,
            trainerEmail: trainerInfo.email,
            memberEmail: user.email,
            memberName: user.displayName,
            day,
            label,
            time,
            package: selectedPackage,
            amountPaid: fee,
            transactionId: result.paymentIntent.id,
            paymentTime: new Date(),
          };

          const bookingRes = await axiosSecure.post("/bookings", bookingData);
          console.log("Booking response:", bookingRes.data);

          // Step 1: Clear card form after payment
          elements.getElement(CardElement).clear();

          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
    <p><strong>Transaction ID:</strong> ${result.paymentIntent.id}</p>
    <p>Thank you for booking with ${trainerInfo.name}!</p>
  `,
            confirmButtonText: "Awesome!",
          }).then(() => {
            navigate(`/trainer-booking/${trainerId}`);
          });
        }
      }
    }
  };

  if (isPending) {
    return "Loading...";
  }
  console.log(trainerInfo);

  return (
    // <div className="max-w-2xl mx-auto my-12 p-6 bg-white rounded-xl shadow-md space-y-6">
    //   {/* Trainer and Slot Info Section */}
    //   <div className="space-y-2 border-b pb-4">
    //     <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
    //     <p>
    //       <strong>Trainer:</strong> {trainerInfo.name}
    //     </p>
    //     <p>
    //       <strong>Day:</strong> {day}
    //     </p>
    //     <p>
    //       <strong>Label:</strong> {label}
    //     </p>
    //     <p>
    //       <strong>Time:</strong> {time}
    //     </p>
    //     <p>
    //       <strong>Package:</strong> {selectedPackage}
    //     </p>
    //     <p>
    //       <strong>Fee:</strong> ${fee}
    //     </p>
    //   </div>

    //   {/* form */}
    //   <form
    //     onSubmit={handleSubmit}
    //     className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
    //   >
    //     <CardElement className="p-4 border rounded"></CardElement>
    //     <button
    //       className="btn btn-primary w-full"
    //       type="submit"
    //       disabled={!stripe}
    //     >
    //       Pay ${fee} to book the slot
    //     </button>

    //     {error && <p className="text-sm text-error">{error}</p>}
    //   </form>
    // </div>

    // plished version
    <div className="max-w-3xl mx-auto my-16 px-4">
      {/* Booking Summary Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center border border-primary mb-8">
        {/* Trainer Image */}
        <img
          src={trainerInfo.image}
          alt={trainerInfo.name}
          className="w-32 h-32 object-cover rounded-full border-4 border-primary shadow-sm"
        />

        {/* Trainer Info */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {trainerInfo.name}
          </h2>
          <p className="text-gray-600">
            <span className="font-semibold">Expertise:</span>{" "}
            {trainerInfo.expertise}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
            <p>
              <strong>📅 Day:</strong> {day}
            </p>
            <p>
              <strong>⏰ Time:</strong> {time}
            </p>
            <p>
              <strong>🎯 Label:</strong> {label}
            </p>
            <p>
              <strong>🎁 Package:</strong> {selectedPackage}
            </p>
            <p>
              <strong>💵 Fee:</strong> ${fee}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg border border-primary space-y-4"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          💳 Enter Card Info
        </h3>
        <CardElement className="p-4 border rounded-md shadow-sm" />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ${fee} to book the slot
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
