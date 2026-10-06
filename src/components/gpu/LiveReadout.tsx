import { useSyncExternalStore } from 'react';
import { getInferenceLive, subscribeInferenceLive } from '../../lib/inferenceLive';

/** What the die is doing right now: real numbers from the browser demo, or an invitation to start it. */
const LiveReadout = () => {
  const live = useSyncExternalStore(subscribeInferenceLive, getInferenceLive);
  const running = live.at > 0;
  return (
    <p className="stage-live" aria-live="off">
      <span className={`stage-live-dot ${running ? 'is-on' : ''}`} />
      {running
        ? `Last inference ${live.lastMs.toFixed(0)} ms · ${live.objects} objects found`
        : 'Die idle. Run the demo and it lights with every inference.'}
    </p>
  );
};

export default LiveReadout;
