'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function MaintenanceBlocker() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [eta, setEta] = useState('45 minutes');
  const [helpline, setHelpline] = useState('+91 99999 88888');
  const pathname = usePathname();

  useEffect(() => {
    // ONLY block normal users INSIDE their secure dashboard area.
    // Landing page (/), Login page (/login), and Admin console (/admin) will remain OPEN.
    if (!pathname?.startsWith('/dashboard')) {
      setIsMaintenance(false);
      return;
    }
    const checkMaintenance = async () => {
      try {
        const res = await fetch('http://localhost:5002/api/system/health');
        if (res.ok) {
          const data = await res.json();
          setIsMaintenance(data.maintenanceMode);
          if (data.maintenanceEta) {
            setEta(data.maintenanceEta);
          }
          if (data.helpline) {
            setHelpline(data.helpline);
          }
        }
      } catch (err) {
        // If server is down, we might want to fail open or closed, but let's just ignore for now
      }
    };

    // Initial check
    checkMaintenance();

    // Poll every 10 seconds to auto-lock or auto-unlock users
    const interval = setInterval(checkMaintenance, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  if (!isMaintenance) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900/95 backdrop-blur-md z-[9999] flex flex-col justify-center items-center text-center p-6 select-none animate-in fade-in duration-500">
      <div className="max-w-xl space-y-6">
        <span className="text-6xl animate-bounce block">⚙️</span>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">🛠️ Platform Maintenance Active</h1>
        <p className="text-zinc-400 text-sm">
          RozgaarHub operations are currently throttled for scheduled system optimizations and security patches. 
          The application sandbox is locked.
        </p>
        <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700 text-left font-mono text-xs text-green-400 space-y-1 shadow-inner">
          <p>&gt; sysStatus: MAINTENANCE_LOCKOUT_ACTIVE</p>
          <p>&gt; connection: SECURED_ADMIN_CONSOLE_ONLY</p>
          <p>&gt; ETA: {eta} remaining</p>
          <p className="mt-2 pt-2 border-t border-zinc-700/50 text-amber-400">&gt; SOS HELPLINE: {helpline}</p>
        </div>
      </div>
    </div>
  );
}
