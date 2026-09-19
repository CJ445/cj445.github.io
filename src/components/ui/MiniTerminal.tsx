import React, { useState } from 'react';


type HistoryItem = {
  type: string;
  text: string;
};

const MiniTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', text: 'CyrilOS v1.0.0 (tty1)' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);


  const [secretNumber, setSecretNumber] = useState<number | null>(null);


  const addLine = (text: string, type: string = 'output') => {
    setHistory((prev) => [...prev, { type, text }]);
  };


  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      addLine(`guest@cyril:~$ ${input}`, 'input');


      if (secretNumber !== null && cmd !== '' && !isNaN(Number(cmd))) {
        const guess = Number(cmd);
        if (guess === secretNumber) {
          addLine('🎉 Correct! You guessed the number.');
          setSecretNumber(null);
        } else if (guess < secretNumber) {
          addLine('Too low ⬇️');
        } else {
          addLine('Too high ⬆️');
        }
        setInput('');
        return;
      }

      switch (cmd) {
        case 'help':
          addLine('Available commands: whoami, skills, projects, bench, clear, sudo');
          addLine('Fun commands: game, guess, rps');
          break;

        case 'whoami':
          addLine('Cyril Jacob | B.Tech CSE (AI & ML) @ Karunya Institute of Technology & Sciences');
          addLine('Status: Software Engineer | Distributed Systems | Cloud & Infrastructure');
          break;

        case 'skills':
          addLine('► Python, SQL, Shell Scripting, REST APIs, Microservices');
          addLine('► Azure, Docker, Kubernetes, Kafka, PostgreSQL, MongoDB');
          addLine('► AI/ML: PyTorch, TensorFlow, OpenCV, YOLOv8, TensorRT');
          break;

        case 'projects':
          addLine('1. Optical-Guided Thermal Super-Resolution (ISRO SIH Finalist)');
          addLine('2. IoT Fleet Management Platform');
          addLine('3. Real-Time Occupancy Analytics System');
          break;

        case 'bench':
        case 'demo':
          addLine('Scrolling to the Inference Monitor...');
          document.getElementById('monitor')?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          });
          break;

        case 'game':
          addLine('🎮 Available games:');
          addLine('• guess  -> Number Guessing Game');
          addLine('• rps    -> Rock Paper Scissors');
          break;

        case 'guess': {
          const num = Math.floor(Math.random() * 10) + 1;
          setSecretNumber(num);
          addLine('I picked a number between 1 and 10. Try to guess!');
          break;
        }

        case 'rps': {
          addLine('Type rock, paper, or scissors');
          setSecretNumber(null);
          break;
        }

        case 'rock':
        case 'paper':
        case 'scissors': {
          const options = ['rock', 'paper', 'scissors'];
          const bot = options[Math.floor(Math.random() * 3)];
          addLine(`You chose: ${cmd}`);
          addLine(`Bot chose: ${bot}`);

          if (cmd === bot) addLine('Draw 🤝');
          else if (
            (cmd === 'rock' && bot === 'scissors') ||
            (cmd === 'paper' && bot === 'rock') ||
            (cmd === 'scissors' && bot === 'paper')
          )
            addLine('You win 🎉');
          else addLine('Bot wins 🤖');
          break;
        }

        case 'sudo':
          addLine('Nice try. This incident will be reported. 🚨');
          break;

        case 'clear':
          setHistory([]);
          setInput('');
          return;

        case '':
          break;

        default:
          addLine(`bash: ${cmd}: command not found`);
      }

      setInput('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border-4 border-black rounded-2xl shadow-neo overflow-hidden flex flex-col font-mono text-sm sm:text-base">
      <div className="bg-gray-200 border-b-4 border-black px-4 py-2 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-custom-red border-2 border-black"></div>
          <div className="w-3 h-3 rounded-full bg-custom-yellow border-2 border-black"></div>
          <div className="w-3 h-3 rounded-full bg-custom-green border-2 border-black"></div>
        </div>
        <span className="font-bold text-black text-xs tracking-widest">root@cyril:~</span>
        <div className="w-10"></div>
      </div>

      <div role="log" aria-label="Terminal output" className="p-4 h-64 overflow-y-auto bg-black text-custom-blue custom-scrollbar">
        {history.map((line, index) => (
          <div
            key={index}
            className={`mb-1 ${line.type === 'input' ? 'text-white' : 'text-custom-blue'}`}
          >
            {line.text}
          </div>
        ))}

        <div className="flex items-center mt-2">
          <span className="text-custom-green mr-2">guest@cyril:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            aria-label="Terminal command"
            className="flex-1 min-h-8 bg-transparent border-none outline-none text-custom-blue caret-custom-blue focus-visible:!shadow-none focus-visible:!outline-none"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniTerminal;