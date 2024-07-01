import React from 'react'
import { cookies } from 'next/headers'
import { Database, Tables } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'
import SubscriptionManagementButton from '@/components/checkout/SubscriptionManagementButton'



const supabase = createServerComponentClient({ cookies });


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

const Dashboard = async () => {

  const [profile,] = await Promise.all([
    getProfile(supabase),
  ])

  return (
    <section className='w-full max-w-3xl mx-auto py-16 px-8'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <div className='flex flex-col gap-4'>
        <div>{profile?.is_subscribed ? 'Subscribed' : 'Not subscribed'}</div>
        <div>契約タイプ：{profile?.interval}</div>
        <div>{profile?.stripe_customer}</div>
        <SubscriptionManagementButton />
      </div>
    </section>
  )
}

export default Dashboard