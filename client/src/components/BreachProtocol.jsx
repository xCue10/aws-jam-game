import React, { useState, useEffect, useRef } from 'react';

const TERMINAL_LINES = [
  { text: '⚠  GUARDDUTY CRITICAL: UnauthorizedAccess:S3/MaliciousIPCaller.Custom', color: 'text-red-400' },
  { text: '⚠  Root login from Tor exit node 185.220.101.45 — 02:35:11 UTC', color: 'text-red-400' },
  { text: '   Initiating Emergency Response Protocol IR-ALPHA...', color: 'text-yellow-400' },
  { text: '', color: '' },
  { text: '$ aws s3 rm s3://customer-data-prod --recursive', color: 'text-green-400' },
  { text: '   delete: s3://customer-data-prod/pii/ssn_records_2024.csv', color: 'text-slate-400' },
  { text: '   delete: s3://customer-data-prod/pii/credit_card_pan.csv', color: 'text-slate-400' },
  { text: '   delete: s3://customer-data-prod/pii/phi_health_records.csv', color: 'text-slate-400' },
  { text: '   Removed 4,200 objects. Bucket wiped.', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '$ aws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE', color: 'text-green-400' },
  { text: '   AccessKey AKIAIOSFODNN7EXAMPLE deleted successfully.', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '$ aws ec2 terminate-instances --instance-ids i-0deadbeef12345678', color: 'text-green-400' },
  { text: '   i-0deadbeef12345678: shutting-down → terminated', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '$ aws secretsmanager rotate-secret --secret-id prod/db/master-password', color: 'text-green-400' },
  { text: '   Rotation initiated. VersionStage: AWSPENDING', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '$ aws kms disable-key --key-id arn:aws:kms:us-east-1:123456789012:key/mrk-1a2b3c', color: 'text-green-400' },
  { text: '   KeyState: Disabled', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '$ aws guardduty archive-findings --detector-id abc123 --finding-ids xyz789', color: 'text-green-400' },
  { text: '   Finding archived. IR ticket logged in Security Hub.', color: 'text-slate-300' },
  { text: '', color: '' },
  { text: '✓  IR-ALPHA COMPLETE — All PII secured before exfiltration.', color: 'text-green-300' },
];

const WIPE_SERVICES = [
  { label: 'S3 customer-data-prod', icon: '🗄️', bar: 'bg-red-500' },
  { label: 'IAM compromised credentials', icon: '🔐', bar: 'bg-orange-500' },
  { label: 'EC2 infected instances', icon: '💻', bar: 'bg-yellow-500' },
  { label: 'RDS production database', icon: '🛢️', bar: 'bg-blue-500' },
  { label: 'Secrets Manager rotation', icon: '🔑', bar: 'bg-purple-500' },
];

const WIPE_DURATION = 900; // ms per service bar

// ─── Confirm phase ────────────────────────────────────────────────────────────
function ConfirmPhase({ onConfirm, onCancel }) {
  const [input, setInput] = useState('');
  const ready = input === 'CONFIRM';

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-[#1a0000] border-2 border-red-600 rounded-2xl p-8 max-w-md w-full space-y-5 shadow-2xl shadow-red-900/50">
        <div className="text-center space-y-2">
          <div className="text-5xl">☢️</div>
          <h2 className="text-2xl font-bold text-red-400 tracking-wide">EMERGENCY WIPE</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            A breach has been detected. Initiate IR-ALPHA to wipe all PII before
            bad actors can exfiltrate it. This action cannot be undone.
          </p>
        </div>

        <div className="border border-red-800 bg-black/40 rounded-lg p-3 text-xs text-slate-400 font-mono space-y-1">
          <p>GuardDuty Finding: <span className="text-red-400">CRITICAL</span></p>
          <p>Threat: UnauthorizedAccess:S3/MaliciousIPCaller</p>
          <p>Exposed data: SSNs, PAN, PHI — 4,200 records</p>
          <p>Time to exfiltration: <span className="text-yellow-400 animate-pulse">~90 seconds</span></p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase tracking-widest">
            Type <span className="text-red-400 font-bold">CONFIRM</span> to initiate emergency wipe
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="CONFIRM"
            autoFocus
            className="w-full bg-black border border-red-800 focus:border-red-500 outline-none text-red-300 placeholder-red-900 rounded-lg px-4 py-2 font-mono text-sm transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!ready}
            className="flex-1 py-2 rounded-lg font-bold text-sm transition-all bg-red-600 hover:bg-red-500 disabled:bg-red-900/40 disabled:text-red-800 text-white"
          >
            INITIATE WIPE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Alert phase ──────────────────────────────────────────────────────────────
function AlertPhase() {
  const [on, setOn] = React.useState(true);
  React.useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 transition-colors duration-300"
      style={{ backgroundColor: on ? '#450a0a' : '#0a0000' }}
    >
      <div className="text-center space-y-4">
        <div className="text-8xl">{on ? '🚨' : '⚠️'}</div>
        <h1
          className="text-6xl font-black tracking-widest uppercase transition-colors duration-300"
          style={{ color: on ? '#f87171' : '#dc2626' }}
        >
          BREACH DETECTED
        </h1>
        <p className="text-red-300 text-2xl font-mono">Unauthorized access — PII exposure imminent</p>
        <p className="text-red-500 text-sm font-mono animate-pulse mt-2">Executing IR-ALPHA...</p>
      </div>
    </div>
  );
}

// ─── Terminal phase ───────────────────────────────────────────────────────────
function TerminalPhase({ visibleLines }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-slate-500 text-xs font-mono">ir-alpha — bash</span>
        </div>
        <div className="font-mono text-sm space-y-0.5 overflow-y-auto max-h-[80vh]">
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`${line.color || 'text-slate-400'} leading-6`}>
              {line.text || '\u00A0'}
            </div>
          ))}
          {visibleLines < TERMINAL_LINES.length && (
            <span className="text-green-400 animate-pulse">█</span>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Wipe phase ───────────────────────────────────────────────────────────────
function WipePhase({ wipedCount, progress }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <p className="text-red-400 font-mono text-xs uppercase tracking-widest animate-pulse">
            IR-ALPHA · Wiping systems
          </p>
          <h2 className="text-3xl font-bold text-white">Securing Environment</h2>
        </div>

        <div className="space-y-4">
          {WIPE_SERVICES.map((svc, i) => {
            const isDone = i < wipedCount;
            const isActive = i === wipedCount;
            const pct = isActive ? progress : isDone ? 100 : 0;

            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className={`font-mono flex items-center gap-2 ${isDone ? 'text-green-400' : isActive ? 'text-white' : 'text-slate-600'}`}>
                    <span>{svc.icon}</span>
                    {svc.label}
                  </span>
                  <span className={`text-xs font-mono ${isDone ? 'text-green-400' : isActive ? 'text-yellow-400' : 'text-slate-700'}`}>
                    {isDone ? 'WIPED ✓' : isActive ? `${pct}%` : 'QUEUED'}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-100 ${isDone ? 'bg-green-500' : svc.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Secured phase ────────────────────────────────────────────────────────────
function SecuredPhase({ onClose, totalScore, playerName }) {
  return (
    <div className="min-h-screen bg-[#001a00] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <div className="text-7xl">✅</div>
          <h1 className="text-4xl font-black text-green-400 tracking-wide">SYSTEM SECURED</h1>
          <p className="text-green-300 font-mono text-sm">
            All PII wiped before exfiltration.<br />
            IR-ALPHA executed successfully.
          </p>
        </div>

        <div className="bg-black/40 border border-green-800 rounded-xl p-4 font-mono text-xs text-left space-y-1 text-green-300">
          <p>✓ S3 customer-data-prod — wiped</p>
          <p>✓ IAM compromised credentials — revoked</p>
          <p>✓ EC2 infected instances — terminated</p>
          <p>✓ RDS production database — snapshot + wipe</p>
          <p>✓ Secrets Manager — rotation complete</p>
          <p>✓ GuardDuty finding — archived to Security Hub</p>
        </div>

        {/* Score is safe */}
        <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 space-y-1">
          <p className="text-xs text-green-500 uppercase tracking-widest">Your score is safe, {playerName}</p>
          <p className="text-4xl font-bold font-mono text-green-300">{totalScore} pts</p>
          <p className="text-xs text-green-700">The wipe was simulated — your progress was never at risk.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 transition-all"
        >
          Return to Mission Board
        </button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BreachProtocol({ onClose, totalScore, playerName }) {
  const [phase, setPhase] = useState('confirm');  // confirm → alert → terminal → wipe → secured
  const [visibleLines, setVisibleLines] = useState(0);
  const [wipedCount, setWipedCount] = useState(0);
  const [wipeProgress, setWipeProgress] = useState(0);

  // Alert → Terminal after 3.5s
  useEffect(() => {
    if (phase !== 'alert') return;
    const t = setTimeout(() => setPhase('terminal'), 3500);
    return () => clearTimeout(t);
  }, [phase]);

  // Terminal: reveal lines one by one
  useEffect(() => {
    if (phase !== 'terminal') return;
    if (visibleLines >= TERMINAL_LINES.length) {
      const t = setTimeout(() => {
        setPhase('wipe');
        setWipedCount(0);
        setWipeProgress(0);
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 260);
    return () => clearTimeout(t);
  }, [phase, visibleLines]);

  // Wipe: fill each bar then advance
  useEffect(() => {
    if (phase !== 'wipe') return;
    if (wipedCount >= WIPE_SERVICES.length) {
      const t = setTimeout(() => setPhase('secured'), 500);
      return () => clearTimeout(t);
    }

    setWipeProgress(0);
    const steps = 30;
    const stepTime = WIPE_DURATION / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setWipeProgress(Math.round((step / steps) * 100));
      if (step >= steps) {
        clearInterval(interval);
        setWipedCount((c) => c + 1);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [phase, wipedCount]);

  if (phase === 'confirm') {
    return (
      <div className="fixed inset-0 z-50">
        <ConfirmPhase
          onConfirm={() => setPhase('alert')}
          onCancel={onClose}
        />
      </div>
    );
  }

  if (phase === 'alert') {
    return <div className="fixed inset-0 z-50"><AlertPhase /></div>;
  }

  if (phase === 'terminal') {
    return <div className="fixed inset-0 z-50 overflow-auto"><TerminalPhase visibleLines={visibleLines} /></div>;
  }

  if (phase === 'wipe') {
    return <div className="fixed inset-0 z-50"><WipePhase wipedCount={wipedCount} progress={wipeProgress} /></div>;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      <SecuredPhase onClose={onClose} totalScore={totalScore} playerName={playerName} />
    </div>
  );
}
