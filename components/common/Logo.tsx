import Image from 'next/image';

export default function Logo() {
  return (
      <Image
        src="/assets/images/logo.svg"
        alt="MusoSpot Logo"
        width={32}
        height={32}
        className="w-8 h-8"
        priority
      />
  );
}