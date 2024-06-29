import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

export async function GET(req: NextRequest, { params }: { params: { priceId: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const authUser = await supabase.auth.getUser();

  if (!authUser.data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: stripe_customer } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', authUser.data.user?.id)
    .single();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


  const session = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:3000/payment/success',
    cancel_url: 'http://localhost:3000/payment/cancel',
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: stripe_customer?.stripe_customer,
  });

  return NextResponse.json({
    id: session.id
  });


}