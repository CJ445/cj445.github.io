import { FaCube, FaThLarge } from 'react-icons/fa';
import { setView } from '../../lib/viewMode';
import type { View } from '../../lib/viewMode';

/** Switches between the 3D unboxing and the original flat page. Shows the view you would switch to. */
const ViewToggle = ({ view }: { view: View }) => {
  const to3d = view === '2d';
  return (
    <button
      type="button"
      onClick={() => setView(to3d ? '3d' : '2d')}
      aria-label={to3d ? 'Switch to the 3D unboxing view' : 'Switch to the classic 2D page'}
      className="flex h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-xs text-primary"
    >
      {to3d ? <FaCube aria-hidden="true" /> : <FaThLarge aria-hidden="true" />}
      <span className="hidden sm:inline">{to3d ? '3D' : '2D'}</span>
    </button>
  );
};

export default ViewToggle;
