import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <Link href="/login" className="ml-auto">
        <Button>Login</Button>
      </Link>
    </header>
  );
}