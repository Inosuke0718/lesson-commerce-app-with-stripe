"use client";

import { Button } from "@/components/ui/button";
import { Session } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
// import { fetch } from 'next/navigation'; // Added this line

const AuthClientButton = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSingIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSingOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleCreateStripeCustomer = async () => {
    const response = await fetch('/api/create-stripe-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: "0024965e-78a5-4994-8650-eb6cc92dc56a", email:  "test@gmail.com", }),
    });
    const result = await response.json();
    alert(`Stripe Customer Status: ${result.message}`);
  };

  return (
    <>
      {session ? (
        <>
          <Button onClick={handleSingOut}>Logout</Button>
          <Button onClick={handleCreateStripeCustomer}>Create Stripe Customer</Button>
        </>
      ) : (
        <Button onClick={handleSingIn}>Sign In</Button>
      )}
    </>
  );
};

export default AuthClientButton;