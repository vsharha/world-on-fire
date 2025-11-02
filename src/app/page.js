import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
      <main>
          <section className="flex flex-col items-center justify-center w-full gap-5 bg-card py-25">
              <h1 className="text-3xl font-bold">See what's going on in the world, right now.</h1>
              <h2 className="text-xl">Get a new perspective on life.</h2>
              <Link href="/map">
                <Button className="text-xl">Go to map</Button>
              </Link>
          </section>
      </main>
  );
}
