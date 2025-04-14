import { Icons } from '@/components/icons';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="bg-background lg:px-6 h-14 flex items-center justify-between mr-2 lg:mr-6">
      <Link href="/" className="flex items-center px-4 text-lg font-medium" prefetch={false}>
        <Icons.logo className="h-6 w-6 mr-2" />
        UoMe
      </Link>
      <nav className="flex items-center gap-6 text-base">
        <Link href="/dashboard" className="font-medium hover:underline underline-offset-4" prefetch={false}>
          Home
        </Link>
        <Link href="#about" className="font-medium hover:underline underline-offset-4" prefetch={false}>
          About
        </Link>
        <Link href="#pricing" className="font-medium hover:underline underline-offset-4" prefetch={false}>
          Pricing
        </Link>
        <Link href="/login" className="font-medium hover:underline underline-offset-4" prefetch={false}>
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
