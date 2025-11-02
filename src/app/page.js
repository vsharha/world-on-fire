import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
      <main>
          <section className="relative flex flex-col items-center justify-center w-full gap-5 min-h-120 bg-none overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center filter blur-xl -z-10" />
              <h1 className="text-3xl font-bold text-center">See what's going on in the world, right now.</h1>
              <h2 className="text-xl">Get a new perspective on life.</h2>
              <Link href="/map">
                <Button className="text-xl">Go to map</Button>
              </Link>
          </section>
      </main>
  );
}
