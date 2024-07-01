import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthServerButton from "@/components/auth/AuthServerButton";
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function Header() {
  const supabase = createServerComponentClient({ cookies });

  const { data: user } = await supabase.auth.getUser();
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="flex justify-between gap-3 items-center p-4 border-gray-200">
      <Link href="/">
        <Button variant="outline">Home</Button>
      </Link>
      {user.user && (
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      )}
      <Link href="/pricing">
        <Button>Pricing</Button>
      </Link>
      <div className="ml-auto">
        <AuthServerButton/>
      </div>
    </header>
  );
}