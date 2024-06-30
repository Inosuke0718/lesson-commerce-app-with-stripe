import { createClientComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const signature = req.headers.get("stripe-signature");
  // Convert the request body to a buffer 
  const reqBuffer = Buffer.from(await req.arrayBuffer());
  



  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature!, endpointSecret!);
    console.log(event);
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data.object;
        await supabase.from('profile').update({
          is_subscribed: true,
          interval: customerSubscriptionCreated.items.data[0].plan.interval,
          stripe_customer: customerSubscriptionCreated.customer
        }).eq('stripe_customer', customerSubscriptionCreated.customer)
        // Then define and call a function to handle the event customer.subscription.created
        break;
      case 'customer.subscription.deleted':
        const customerSubscriptionDeleted = event.data.object;
        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      case 'customer.subscription.updated':
        const customerSubscriptionUpdated = event.data.object;
        // Then define and call a function to handle the event customer.subscription.updated
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err: any) {
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Webhook received");
  return NextResponse.json({ message: 'Webhook received' });
}


