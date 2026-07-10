export default function AnnouncementTicker() {
  const items = [
    '🌸 Free delivery on orders over ৳1500',
    '⚡ Flash Sale — up to 30% OFF on K-Beauty',
    '✨ New arrivals from COSRX, Laneige & Klairs',
    '🇰🇷 Authentic Korean skincare imported directly',
    '💳 Pay with bKash, Nagad, or Cash on Delivery',
    '🚚 Delivering to all 64 districts of Bangladesh',
    '⭐ Rated 4.8/5 by 50,000+ happy customers',
    '🎁 Buy 2 Get 1 Free on selected serums',
  ];

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
