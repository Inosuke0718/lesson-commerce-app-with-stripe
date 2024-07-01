'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import axios from "axios";
import { useRouter } from 'next/navigation'

function SubscriptionManagementButton() {
  const router = useRouter();
  const loadPortal = async () => {
    // debugger
    const response = await axios.get('http://localhost:3000/api/portal/');
    // const response2 = await axios.get(process.env.NEXT_PUBLIC_DOMEIN);
    const data = await response.data;

    router.push(data.url);
  }
  return (
    <div>
      <Button onClick={loadPortal}>SubscriptionManagementButton</Button>
    </div>
  )
}

export default SubscriptionManagementButton