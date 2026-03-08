"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-[#006AA7] text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Folkets Tips
        </Link>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="text-sm hidden sm:inline">
                {session.user.name}
              </span>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition"
              >
                Logga ut
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-sm bg-[#FECC02] text-[#006AA7] font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-300 transition"
            >
              Logga in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
