"use client";

import CheckoutPage from "./Components/CheckOutPage";
import convertToSubCurrency from "./lib/convertToSubCurrency";
import PriceSection from "./Components/PriceSection";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const amount = 19.99;
  return (
    <main className="max-w-3xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2"></h1>
        <h2 className="text-2xl">
          Aveți de achitat
          <span className="font-bold"> {amount} RON</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubCurrency(amount),
          currency: "ron",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
