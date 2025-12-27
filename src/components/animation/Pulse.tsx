interface PulseProps { children: React.ReactNode; active?: boolean; }
export function Pulse({ children, active = true }: PulseProps) {
  return <div className={active ? 'animate-pulse' : ''}>{children}</div>;
}
