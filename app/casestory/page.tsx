import Image from "next/image";
import Link from "next/link";

export default function CaseStory() {
  const projectStages = [
    { number: "01", label: "Crime Report", route: "/case" },
    { number: "02", label: "TIMELINE", route: "/day" },
    { number: "03", label: "EVIDENCES", route: "/evidence" },
    { number: "04", label: "SUSPECTS", route: "/suspects" },
    { number: "05", label: "VERDICT", route: "/verdict" },
  ];

  return (
    <div className="h-screen overflow-hidden text-[#FFFFFF] font-body relative">
      {/* Background Image - Covers entire page */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/assets/backgrounds/caseStory.webp"
          alt="Crime board scene"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#070A12] opacity-60"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6">
        {/* Back Button */}
        <Link href="/" className="text-white hover:text-gray-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Page Heading */}
        <Link href="/" className="text-xl md:text-2xl font-headline tracking-wide uppercase ml-auto">
        Dossier
        </Link>
      </nav>

      {/* Main Content - Two Column Layout */}
      <main className="relative z-10 flex flex-col lg:flex-row h-full pt-28 lg:pt-0">

        {/* Right Section - Project Stages - Fixed from bottom */}
        <div className="fixed bottom-0 left-0 right-0 w-full lg:w-1/2 h-[70vh] lg:h-auto lg:relative lg:flex lg:flex-col lg:justify-center px-6 md:px-12 lg:px-16 pb-10 pt-8 lg:py-0 z-20 order-1 lg:order-2 overflow-y-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-12 md:mb-16 font-headline text-[#FFFFFF]">
            CRIME FILE
          </h1>

          {/* Project Stages List */}
          <div className="space-y-6 md:space-y-8">
            {projectStages.map((stage, index) => (
              <Link
                key={index}
                href={stage.route}
                className="flex items-center gap-4 group cursor-pointer"
              >
                {/* Stage Number */}
                <span className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-[#FFFFFF] min-w-[60px] md:min-w-[80px] font-headline">
                  {stage.number}
                </span>
                
                {/* Stage Label */}
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xl md:text-2xl lg:text-3xl font-light uppercase tracking-wide text-[#FFFFFF] group-hover:opacity-80 transition-opacity font-headline">
                    {stage.label}
                  </span>
                  {/* Horizontal Line */}
                  <div className="flex-1 h-px bg-[#FFFFFF] opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Left Section - Visual Scene */}
        <div className="hidden lg:block relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-full z-10 order-2 lg:order-1">
        </div>
      </main>
    </div>
  );
}
