import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useNavigate, useParams, useLocation } from "react-router";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const { trainerId } = useParams();
  const [fee, setFee] = useState(0);
  const navigate = useNavigate();
  const feeInCents = fee * 100;
  const [processing, setProcessing] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const day = searchParams.get("day");
  const label = searchParams.get("label");
  const time = searchParams.get("time");
  const selectedPackage = searchParams.get("package");
  const selectedClassName = searchParams.get("class");

  // Load trainer
  const { isPending, data: trainerInfo = {} } = useQuery({
    queryKey: ["trainer", trainerId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trainers/${trainerId}`);
      return res.data;
    },
  });

  // Load class data
  const { data: allClasses = [] } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const res = await axiosSecure.get("/classes");
      return res.data;
    },
  });

  const selectedClassInfo = allClasses.find(
    (cls) => cls.className === selectedClassName
  );

  useEffect(() => {
    if (selectedPackage === "Basic") setFee(10);
    else if (selectedPackage === "Standard") setFee(50);
    else if (selectedPackage === "Premium") setFee(100);
  }, [selectedPackage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;
    setProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      const res = await axiosSecure.post("create-payment-intent", {
        feeInCents,
        trainerId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          const bookingData = {
            trainerId,
            trainerName: trainerInfo.name,
            trainerEmail: trainerInfo.email,
            trainerSkill: trainerInfo.expertise,
            memberEmail: user.email,
            memberName: user.displayName,
            memberImage: user.photoURL,
            day,
            label,
            time,
            package: selectedPackage,
            amountPaid: fee,
            classId: selectedClassInfo?._id,
            classTitle: selectedClassInfo?.className,
            transactionId: result.paymentIntent.id,
            paymentTime: new Date(),
          };

          await axiosSecure.post("/bookings", bookingData);

          const paymentInfo = {
            transactionId: result.paymentIntent.id,
            memberEmail: user.email,
            amount: fee,
            trainerId,
            trainerEmail: trainerInfo.email,
            package: selectedPackage,
            day,
            label,
            time,
            classId: selectedClassInfo?._id,
            classTitle: selectedClassInfo?.className,
            paymented_at: new Date(),
            status: "succeeded",
          };

          await axiosSecure.post("/payments", paymentInfo);

          // Step 3: Increase booked count of the class
          if (selectedClassInfo?._id) {
            await axiosSecure.patch(
              `/classes/increase-booked/${selectedClassInfo._id}`
            );
          }

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
            navigate("/dashboard/booked-trainer");
          });
        }
      }
    }

    setProcessing(false);
  };

  if (isPending)
    return <p className="text-center py-10">Loading trainer info...</p>;

  return (
    <div className="max-w-4xl mx-auto my-16 px-4 space-y-10">
      {/* Trainer + Class Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainer Info */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border border-primary">
          <img
            src={trainerInfo.image}
            alt={trainerInfo.name}
            className="w-32 h-32 object-cover rounded-full border-4 border-primary shadow-sm mb-4"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {trainerInfo.name}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Expertise:</strong>{" "}
            {Array.isArray(trainerInfo.expertise)
              ? trainerInfo.expertise.join(", ")
              : trainerInfo.expertise}
          </p>
          <div className="text-sm text-gray-700 space-y-1 text-center">
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

        {/* Class Info */}
        {selectedClassInfo && (
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-primary flex flex-col items-center">
            <img
              src={selectedClassInfo.image}
              alt={selectedClassInfo.className}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold text-secondary mb-1 text-center">
              {selectedClassInfo.className}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Category:</strong> {selectedClassInfo.category}
            </p>
            <p className="text-sm text-gray-700 text-center">
              {selectedClassInfo.details.slice(0, 120)}...
            </p>
          </div>
        )}
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
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : `Pay $${fee} to book the slot`}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
