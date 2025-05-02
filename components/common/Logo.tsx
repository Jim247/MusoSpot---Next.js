import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/images/logo.svg"
        alt="MusoSpot Logo"
        width={32}
        height={32}
        className="w-8 h-8"
        priority
      />
    </Link>
  );
}