import { useSyncExternalStore } from 'react';
import { FLEET_PHASES, getFleetPhase, subscribeFleetPhase } from '../../lib/fleetState';

/** One line that narrates the lit node: detect, find the cause, dispatch a fix, verify. */
const FleetReadout = () => {
  const phase = useSyncExternalStore(subscribeFleetPhase, getFleetPhase);
  return (
    <p className="stage-live" aria-live="polite">
      <span className={`stage-live-dot ${phase === 1 || phase === 2 ? 'is-on' : ''}`} />
      {FLEET_PHASES[phase]}
    </p>
  );
};

export default FleetReadout;
