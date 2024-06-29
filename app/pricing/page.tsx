import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Stripe from 'stripe'

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

const PricingPage = async () => {
  const plans = await getAllPlans();
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
              <Button>get subscription</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}

export default PricingPage