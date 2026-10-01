import { FaTerminal } from 'react-icons/fa';
import { setAgentMode } from '../../lib/agentMode';

const AgentToggle = () => (
  <button
    type="button"
    onClick={() => setAgentMode(true)}
    aria-label="Switch to agent mode: the whole portfolio as one markdown file"
    className="flex h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-xs text-primary"
  >
    <FaTerminal aria-hidden="true" />
    <span className="hidden sm:inline">Agent mode</span>
  </button>
);

export default AgentToggle;
