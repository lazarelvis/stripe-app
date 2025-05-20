"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubCurrency from "../../lib/convertToSubCurrency";

const CheckoutPage = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
        });

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Failed to create payment intent", err);
        setErrorMessage("Eroare la crearea plății.");
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    try {
      // Submit the payment form
      await elements.submit();

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?amount=${amount}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage("A apărut o eroare neașteptată.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret ? (
        <>
          <PaymentElement />
          <button
            type="submit"
            disabled={loading || !stripe}
            className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse cursor-pointer"
          >
            {loading ? "Se procesează..." : `Plătește ${amount} RON`}
          </button>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </>
      ) : (
        <p>Se încarcă formularul de plată...</p>
      )}
    </form>
  );
};

export default CheckoutPage;
