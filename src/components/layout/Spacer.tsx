interface SpacerProps { size?: 1 | 2 | 4 | 6 | 8 | 12 | 16; }
export function Spacer({ size = 4 }: SpacerProps) {
  return <div className={`h-${size}`} />;
}
