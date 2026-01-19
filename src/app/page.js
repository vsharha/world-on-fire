import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewsFeed from "@/components/NewsFeed";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1">
        <section className="relative flex flex-col items-center justify-center w-full gap-5 h-90 bg-none overflow-hidden rounded-lg p-5">
          <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center filter blur-xl -z-10" />
          <h1 className="text-3xl font-bold text-center">
            See what&apos;s going on in the world, right now.
          </h1>
          <h2 className="text-xl">Get a new perspective on life.</h2>
          <Link href="/map">
            <Button className="text-xl">Go to map</Button>
          </Link>
        </section>
        <div className="w-full flex items-center justify-center">
          <NewsFeed className="w-full max-w-150 m-2 mt-3" defaultOpen={true} />
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <div>
          © {new Date().getFullYear()} World on Fire. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
