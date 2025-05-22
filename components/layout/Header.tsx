import Logo from '@components/common/Logo';
import UserDropdown from '@components/UserDropdown';
import Link from 'next/link';

interface LinkType {
  text?: string;
  href?: string;
}

interface HeaderProps {
  links?: Array<LinkType>;
}

export default function Header({ links = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white z-50 flex-none mx-auto w-full border-b border-gray-50/0 ease-in-out">
      <div className="relative text-default py-3 px-3 md:px-6 mx-auto w-full max-w-7xl flex justify-between items-center">
        <Link className="flex items-center" href="/">
          <Logo /><span className='pl-4 text-xl font-bold'>MusoSpot</span> 
        </Link>
        <nav className="flex-1 flex justify-center">
          <ul className="flex flex-row gap-6 text-base font-medium">
            {links.map(({ text, href }) => (
              <li key={text}>
                <Link href={href || '#'} className="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap">
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
