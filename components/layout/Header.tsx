import React from "react";
import Link from "next/link";
import ToggleMenu from "./ToggleMenu";
import Logo from "../common/Logo";
import UserDropDown from '../UserDropdown'

interface MenuLink {
  text?: string;
  href?: string;
  links?: Array<MenuLink>;
}

interface HeaderProps {
  links?: Array<MenuLink>;
  isSticky?: boolean;
  isDark?: boolean;
  isFullWidth?: boolean;
  showToggleTheme?: boolean;
  position?: "left" | "center" | "right";
}

export default function Header({
  links = [],
  isSticky = false,
  isDark = false,
  isFullWidth = false,
  position = "center",
}: HeaderProps) {
  return (
    <header
      className={`top-0 z-50 flex-none mx-auto w-full border-b border-gray-50/0 transition-[opacity] ease-in-out ${
        isSticky ? "sticky" : "relative"
      } ${isDark ? "dark" : ""}`}
      id="header"
    >
      <div className="absolute inset-0"></div>
      <div
        className={`relative text-default py-3 px-3 md:px-6 mx-auto w-full ${
          position !== "center"
            ? "md:flex md:justify-between"
            : "md:grid md:grid-cols-3 md:items-center"
        } ${!isFullWidth ? "max-w-7xl" : ""}`}
      >
        <div className={`flex justify-between ${position === "right" ? "mr-auto" : ""}`}>
          <Link className="flex items-center" href="/">
            <Logo />
            <span className="font-bold pl-3 text-xl">MusoSpot</span>
          </Link>
          <div className="flex items-center md:hidden">
          <ToggleMenu />
          </div>
        </div>
        <nav
          className="items-center w-full md:w-auto hidden md:flex md:mx-5 text-default overflow-y-auto overflow-x-hidden md:overflow-y-visible md:overflow-x-auto md:justify-self-center"
          aria-label="Main navigation"
        >
          <ul className="flex flex-col md:flex-row md:self-center w-full md:w-auto text-xl md:text-[0.9375rem] tracking-[0.01rem] font-medium md:justify-center">
            {links.map(({ text, href, links }) => (
              <li key={text} className={links?.length ? "dropdown" : ""}>
                {links?.length ? (
                  <>
                    <button
                      type="button"
                      className="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap"
                    >
                      {text}
                      {/* Add your icon here */}
                    </button>
                    <ul className="dropdown-menu md:backdrop-blur-md dark:md:bg-dark rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white/90 md:min-w-[200px] drop-shadow-xl">
                      {links.map(({ text: text2, href: href2 }) => (
                        <li key={text2}>
                          <Link
                            className="first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
                            href={href2 || "#"}
                          >
                            {text2}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    className="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap"
                    href={href || "#"}
                  >
                    {text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:self-center md:flex items-center md:mb-0 fixed w-full md:w-auto md:static justify-end left-0 rtl:left-auto rtl:right-0 bottom-0 p-3 md:p-0 md:justify-self-end">
          <div className="items-center flex justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <UserDropDown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}