"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isManage = pathname === "/manage";

  return (
    <header className="w-full bg-gray-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {isHome ? (
        <h1 className="text-lg font-bold">Portfolio Manager</h1>
      ) : (
        <Link href="/" className="text-lg font-bold hover:underline">
          Portfolio Manager
        </Link>
      )}

      <div className="flex items-center gap-4">
        {!isManage && (
          <Link
            href="/manage"
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="Manage Stocks"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        )}

        <button className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2 rounded-lg">
          <Image
            src="/profile.png"
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
