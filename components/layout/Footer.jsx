import Link from "next/link";
import { BookOpen, Mail, Phone } from "lucide-react";

// New X (Twitter) logo as SVG
const XLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ── Brand ── */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Life<span className="text-violet-400">Lessons</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Preserve personal wisdom, share meaningful insights, and grow
              through the experiences of others.
            </p>
          </div>

          {/* ── Navigation ── */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/" className="hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link href="/public-lessons" className="hover:text-violet-400 transition-colors">Public Lessons</Link></li>
              <li><Link href="/pricing" className="hover:text-violet-400 transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-violet-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/terms" className="hover:text-violet-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-violet-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* ── Contact & Social ── */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-violet-400 flex-shrink-0" />
                <a href="mailto:hello@lifelessons.app" className="hover:text-violet-400 transition-colors">
                  hello@lifelessons.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-violet-400 flex-shrink-0" />
                <span>+880 1800-000000</span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <XLogo />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {currentYear} LifeLessons. All rights reserved.</p>
          <p className="text-gray-600">Built with Next.js & MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
