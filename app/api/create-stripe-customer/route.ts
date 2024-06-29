import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// export async function POST(req: Request) {
export async function POST(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET");
  if (query !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const data = await req.json();
  const { id, email } = data.record;
  // const { id, email } = data;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  });

  // for debug
  // console.log("customer:", customer);
  // console.log("id:", id);

  await supabase.from("profile").update({
    stripe_customer: customer.id,
  }).eq("id", id);


  // const userResponse = await supabase.auth.getUser();
  // await supabase.from("profile").update({
  //   stripe_customer_id: customer.id,
  // }).eq("id", userResponse.data.user?.id);

  return Response.json({ message: "Customer created", customer });
}