"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import NavBar from "../common/NavBar";
import ProductCarouselHero from "@/components/sections/ProductCarouselHero";
import BentoGridSection from "@/components/sections/BentoGridSection";

export default function HomeIndex() {
  const f = useTranslations("Footer");

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />
      <main className="flex-1">
        <ProductCarouselHero reverseMobileLayout={true}/>

        {/* Updated ABC Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          {/* Use container from example, adjust max width */}
          <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="lg:w-3/4"> {/* Optional: restrict width like example */}
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 sm:text-4xl md:text-5xl">
                  Growing is as easy as ABC
                </h2>
                <p className="mt-3 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Acquire, Build, and Convert Your Way to Success
                </p>
                {/* Optional: Add a link like the example if needed */}
                {/* <p className="mt-5">
                  <a
                    className="inline-flex items-center gap-x-1 group font-medium hover:underline underline-offset-4 "
                    href="#"
                  >
                    Learn more
                    <ChevronRightIcon className="flex-shrink-0 w-4 h-4 transition ease-in-out group-hover:translate-x-1" />
                  </a>
                </p> */}
              </div>
              {/* End Left Column */}

              {/* Right Column */}
              <div className="space-y-6 lg:space-y-10">
                {/* Acquire Block */}
                <div className="flex">
                  {/* Icon Skipped */}
                  <div className="ms-5 sm:ms-8"> {/* Adjust margin if no icon */}
                    <h3 className="text-base sm:text-lg font-semibold">
                      Acquire Customer Data
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      Capture insights from every reservation, delivery, and dine-in visit to build a powerful customer database.
                    </p>
                  </div>
                </div>
                {/* End Acquire Block */}

                {/* Build Block */}
                <div className="flex">
                  {/* Icon Skipped */}
                  <div className="ms-5 sm:ms-8"> {/* Adjust margin if no icon */}
                    <h3 className="text-base sm:text-lg font-semibold">
                      Build Your Brand
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      Create a seamless online presence that reflects your restaurant&apos;s identity and keeps customers engaged.
                    </p>
                  </div>
                </div>
                {/* End Build Block */}

                {/* Convert Block */}
                <div className="flex">
                  {/* Icon Skipped */}
                  <div className="ms-5 sm:ms-8"> {/* Adjust margin if no icon */}
                    <h3 className="text-base sm:text-lg font-semibold">
                      Convert for Growth
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      Turn first-time diners into regulars with automated rewards, campaigns, and personalized reminders.
                    </p>
                  </div>
                </div>
                {/* End Convert Block */}
              </div>
              {/* End Right Column */}
            </div>
            {/* End Grid */}
          </div>
        </section>

        {/* Render the new Bento Grid section */}
        <BentoGridSection />

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {f("copyright")}
        </p>
        <nav className=" flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
            href="https://github.com/S0vers/i18n-Nextjs-BoilerPlate"
            target="_blank"
            rel="noopener noreferrer"
          >
            {f("githubLink")}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
