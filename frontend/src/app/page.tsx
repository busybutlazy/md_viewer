import { Suspense } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { NewDocumentCard } from "@/components/home/NewDocumentDialog";
import { SampleCards } from "@/components/home/SampleCards";
import { UploadPanel } from "@/components/home/UploadPanel";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <HomeHero />

      <section className="mb-14">
        <div className="grid gap-4 lg:grid-cols-[2fr_3fr] lg:items-stretch">
          <NewDocumentCard />
          <Suspense fallback={null}>
            <UploadPanel />
          </Suspense>
        </div>
      </section>

      <SampleCards />
    </main>
  );
}
