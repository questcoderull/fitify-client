import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useParams } from "react-router";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const { trainerId } = useParams();
  const [fee, setfee] = useState(0);

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
  //   const day = searchParams.get("day");
  //   const label = searchParams.get("label");
  //   const time = searchParams.get("time");
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
    }

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
          name: "Jenny Rosen",
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        console.log(result);
      }
    }
  };

  if (isPending) {
    return "Loading...";
  }
  console.log(trainerInfo);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-4 border rounded"></CardElement>
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ${fee} to book the slot
        </button>

        {error && <p className="text-sm text-error">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
