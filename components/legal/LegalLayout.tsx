import Link from 'next/link';
import { ChevronRight, Clock, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

interface LegalLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalLayout({
  title,
  description,
  lastUpdated,
  sections,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#1C1C2E] via-[#2D1B2E] to-[#1C1C2E] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C4818A]/20 border border-[#C4818A]/30 mb-5">
            <FileText size={26} className="text-[#E8A0AA]" />
          </div>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-white mb-3">
            {title}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <nav
          aria-label="Breadcrumb"
          className="max-w-4xl mx-auto px-4 sm:px-6 py-4"
        >
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#C4818A] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={14} className="text-gray-300" />
            </li>
            <li className="text-[#C4818A] font-medium">{title}</li>
          </ol>
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-100">
          <Clock size={15} className="text-[#C4818A]" />
          <span>Last Updated: </span>
          <time className="font-medium text-gray-700">{lastUpdated}</time>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                {section.heading}
              </h2>
              {section.paragraphs?.map((para, i) => (
                <p
                  key={i}
                  className="text-gray-600 leading-relaxed mb-3 text-[15px]"
                >
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-2.5 mt-4">
                  {section.list.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-600 text-[15px] leading-relaxed"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C4818A] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-14 p-6 sm:p-8 bg-gradient-to-br from-blush-50 to-champagne-50 rounded-2xl border border-blush-100">
          <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2">
            Questions?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            If you have any questions about this policy, feel free to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="https://www.facebook.com/beautydokanbd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#C4818A] text-white text-sm font-medium hover:bg-[#B06E77] transition-colors"
            >
              Message on Facebook
            </Link>
            <a
              href="mailto:support@beautydokanbd.com"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
