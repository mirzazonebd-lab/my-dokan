'use client';

import { SITE_INFO } from '@/lib/config/site-info';

export default function AnnouncementTicker() {
  const items = SITE_INFO.announcements;
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#C4818A] text-white py-2.5 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker-content">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center text-sm font-medium px-8"
            >
              {item}
              <span className="mx-4 text-white/40">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
