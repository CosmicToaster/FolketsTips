import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">&#9917;</div>
        <h1 className="text-4xl font-bold text-[#006AA7] mb-2">
          Folkets Tips
        </h1>
        <p className="text-lg text-gray-600">
          Samla in tipsen. Generera Folkets rad.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="space-y-3 text-left text-gray-600">
          <div className="flex items-start gap-3">
            <span className="bg-[#006AA7] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              1
            </span>
            <p>Logga in och skapa ett rum med en teckenbudget</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-[#006AA7] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              2
            </span>
            <p>Dela länken med dina vänner</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-[#006AA7] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              3
            </span>
            <p>Alla skickar in sina 13 rader</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-[#FECC02] text-[#006AA7] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              &#9733;
            </span>
            <p>
              <strong>Generera Folkets Tips</strong> - en viktad slumpad rad
              baserad på allas tips!
            </p>
          </div>
        </div>

        {session?.user ? (
          <Link
            href="/room/create"
            className="inline-block w-full py-3 bg-[#FECC02] text-[#006AA7] rounded-lg font-semibold text-lg hover:bg-yellow-300 transition shadow-md"
          >
            Skapa nytt rum
          </Link>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="w-full py-3 bg-[#FECC02] text-[#006AA7] rounded-lg font-semibold text-lg hover:bg-yellow-300 transition shadow-md"
            >
              Logga in med Google
            </button>
          </form>
        )}
      </div>

      <p className="text-sm text-gray-400 mt-8">
        Ett verktyg for att samla in Stryktipset-rader. Ingen riktig betting.
      </p>
    </div>
  );
}
