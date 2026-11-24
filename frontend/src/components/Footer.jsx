function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0B0F1A] border-t border-[#263049] text-[#94A3B8] font-sans mt-20 sm:mt-28">
      {/* Upper Main Footer Content */}
      <div className="w-full px-6 sm:px-10">
        <div className="max-w-7xl mx-auto w-full py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand & Mission Column (spans 2 on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <img src="/logo.svg" alt="HavenCode" className="h-8 sm:h-9 w-auto" />
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
                The modern platform for sharpening data structures &amp;
                algorithms, mastering technical coding interviews, and building
                computational intuition.
              </p>
            </div>

            {/* Column 1: Navigation / Platform (Non-clickable informational items) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFE2F2] mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-sm text-[#94A3B8]">
                <li>Problem Catalog</li>
                <li>Solved Problems</li>
                <li>My Submissions</li>
                <li>Practice Tracks</li>
              </ul>
            </div>

            {/* Column 2: Core Topics (Non-clickable informational items) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFE2F2] mb-4">
                Core Topics
              </h4>
              <ul className="space-y-2.5 text-sm text-[#94A3B8]">
                <li>Arrays &amp; Hashing</li>
                <li>Strings &amp; Pointers</li>
                <li>Dynamic Programming</li>
                <li>Trees &amp; Graphs</li>
              </ul>
            </div>

            {/* Column 3: Compilers & Tech */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFE2F2] mb-4">
                Execution
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                  <span>C++ (GCC 17)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]"></span>
                  <span>Java (OpenJDK 17)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                  <span>Python 3.11</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                  <span>JavaScript (Node.js)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-[#263049] bg-[#0A0E19] w-full px-6 sm:px-10">
        <div className="max-w-7xl mx-auto w-full py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} HavenCode.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#94A3B8]">
              Crafted for developers with high standards.
            </span>

            {/* Back to Top Button - Left as the ONLY clickable action */}
            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171B27] hover:bg-[#262A36] text-[#DFE2F2] border border-[#263049] transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <svg
                className="w-3.5 h-3.5 fill-none stroke-current stroke-2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
