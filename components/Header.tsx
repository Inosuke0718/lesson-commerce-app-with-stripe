import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthServerButton from "@/components/auth/AuthServerButton";

export default function Header() {
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="flex justify-between gap-3 items-center p-4 border-gray-200">
      <Link href="/">
        <Button variant="outline">Home</Button>
      </Link>
      <Link href="/pricing">
        <Button>Pricing</Button>
      </Link>
      <div className="ml-auto">
        <AuthServerButton/>
      </div>
    </header>
  );
}