import { useMemo, useState } from 'react';
import { buildAgentMarkdown } from '../data/agentMarkdown';
import { setAgentMode } from '../lib/agentMode';

const btn =
  'cursor-pointer border border-[#00ff41]/60 px-3 py-1.5 text-xs uppercase tracking-widest transition-colors hover:bg-[#00ff41] hover:text-black';

/** The portfolio as a single markdown file. The <pre> text is the file, byte for byte. */
const AgentView = () => {
  const markdown = useMemo(() => buildAgentMarkdown(), []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  };

  return (
    <div className="agent-view min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#00ff41]/30 pb-3 text-xs">
          <span className="agent-glow">
            cyril-jacob/agent.md<span className="agent-cursor" aria-hidden="true">█</span>
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={copy} className={btn}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a href="agent.md" className={btn}>
              Raw
            </a>
            <button type="button" onClick={() => setAgentMode(false)} className={btn}>
              Exit
            </button>
          </div>
        </div>
        <main>
          <pre className="agent-glow whitespace-pre-wrap break-words text-sm leading-6">{markdown}</pre>
        </main>
      </div>
    </div>
  );
};

export default AgentView;
