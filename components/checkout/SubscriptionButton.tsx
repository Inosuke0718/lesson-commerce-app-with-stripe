"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";

const SubscriptionButton = ({ planId }: { planId: string }) => {
  const processSubscription = async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);


    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);


    await stripe?.redirectToCheckout({
      sessionId: data.id,
    });
  };

  return (
    <Button onClick={async () => await processSubscription()}>
      Subscribe
    </Button>
  )
}

export default SubscriptionButton;