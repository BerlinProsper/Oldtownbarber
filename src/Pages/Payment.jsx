
import { useServiceContext } from "../Context/MyContext";

import React, { useEffect, useState } from "react";

export default function PaymentPage() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const {totalPrice} = useServiceContext();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: totalPrice * 100, // in paise
      currency: "INR",
      name: "customer@oldtown",
      description: "Order Payment",
      image: "./logo.png",
      handler: function (response) {
        console.log("Payment successful:", response);
        setPaymentSuccess(true);
      },
      prefill: {
        name: "Customer@oldtown",
      },
      theme: {
        color: "#2f6b5f",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {paymentSuccess ? (
        <h2 style={{ color: "#2f6b5f" }}>✅ Thank you for your payment!</h2>
      ) : (
        <>
          <h2>Pay ₹{totalPrice}</h2>
          <button
            onClick={handleRazorpayPayment}
            style={{
              backgroundColor: "#2f6b5f",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Pay Now
          </button>
        </>
      )}
    </div>
  );
}


