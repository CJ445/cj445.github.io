import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

const COUNTER_URL = 'https://cj445.goatcounter.com/counter/TOTAL.json';

/**
 * Shows the unique-visitor total tracked by GoatCounter.
 * Renders nothing until a real number arrives, so a blocked or failed request leaves no gap.
 */
const VisitorCount = ({ className = '' }: { className?: string }) => {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(COUNTER_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { count_unique?: string }) => {
        // GoatCounter formats numbers with separators ("1 234"), so keep digits only.
        const n = Number(String(data.count_unique ?? '').replace(/\D/g, ''));
        if (Number.isFinite(n) && n > 0) setVisitors(n);
      })
      .catch(() => {
        /* offline, blocked, or endpoint disabled: show nothing */
      });
    return () => controller.abort();
  }, []);

  if (visitors === null) return null;

  return (
    <p
      className={`inline-flex items-center gap-2 bg-white text-black border-2 border-black rounded-full px-3 py-1 font-mono text-xs font-bold shadow-neo-sm ${className}`}
    >
      <FaEye aria-hidden="true" />
      <span>{visitors.toLocaleString('en-US')} visitors</span>
    </p>
  );
};

export default VisitorCount;
