import { Suspense } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { SampleCards } from "@/components/home/SampleCards";
import { UploadPanel } from "@/components/home/UploadPanel";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-14 lg:px-8">
      {/* Hero: text left + drop zone right */}
      <section className="mb-[72px] grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <HomeHero />
        <Suspense fallback={null}>
          <UploadPanel />
        </Suspense>
      </section>

      {/* Mode cards + templates */}
      <SampleCards />
    </main>
  );
}
