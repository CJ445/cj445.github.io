import React, { useEffect, useState } from 'react';

const COUNTER_URL = 'https://cj445.goatcounter.com/counter/TOTAL.json';

/**
 * Shows the unique-visitor total tracked by GoatCounter.
 * Renders nothing until a real number arrives, so a blocked or failed request leaves no gap.
 */
const VisitorCount = () => {
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
    <p className="text-sm text-gray-300 mb-2">
      <span className="font-mono font-bold text-custom-green">{visitors.toLocaleString('en-US')}</span> visitors so far
    </p>
  );
};

export default VisitorCount;
