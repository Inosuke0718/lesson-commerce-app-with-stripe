import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Stripe from 'stripe'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database, Tables } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import SubscriptionButton from '@/components/checkout/SubscriptionButton'
import AuthServerButton from '@/components/auth/AuthServerButton'
import Link from 'next/link'

const getAllPlans = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { data: plans } = await stripe.plans.list();

  const organizedPlans = await Promise.all(plans.map(async (plan) => {
    const product = await stripe.products.retrieve(plan.product as string);
    return {
      id: plan.id,
      name: product.name,
      price: plan.amount,
      interval: plan.interval,
      currency: plan.currency,
    }
  }));

  const sortedPlans = organizedPlans.sort((a, b) => a.price! - b.price!);
  return sortedPlans;
}

const getProfile = async (supabase: SupabaseClient<Database>): Promise<Tables<'profile'>> => {
  const authUser = await supabase.auth.getUser();
  const { data: profile } =
    await
      supabase
        .from('profile')
        .select('*')
        .eq("id", authUser.data.user?.id)
        .single();
  return profile;
}

const PricingPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const authUser = await supabase.auth.getUser();

  const [profile, plans] = await Promise.all([
    getProfile(supabase),
    getAllPlans()
  ])

  const showSubscription = !!authUser.data.user && !profile.is_subscribed;
  const showCreateAccountButton = !authUser.data.user;
  const showManageSubscriptionButton = !!authUser.data.user && profile.is_subscribed;

  return (
    <>
      <h1 className='text-2xl font-bold'>Pricing</h1>

      <div className='w-full max-w-3xl mx-auto py-16 flex justify-around'>
        {plans.map((plan) => (
          <Card className='shadow-md' key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{plan.price} {plan.currency} / {plan.interval}</p>
            </CardContent>
            <CardFooter>
              {showSubscription && <SubscriptionButton planId={plan.id} />}
              {showCreateAccountButton && <AuthServerButton />}
              {showManageSubscriptionButton && <Button ><Link href='/dashboard'>manage subscription</Link></Button>}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default PricingPage;