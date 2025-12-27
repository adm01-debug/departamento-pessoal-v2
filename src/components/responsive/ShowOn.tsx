interface ShowOnProps { mobile?: boolean; tablet?: boolean; desktop?: boolean; children: React.ReactNode; }
export function ShowOn({ mobile, tablet, desktop, children }: ShowOnProps) {
  const classes = [];
  if (!mobile) classes.push('hidden sm:block');
  if (!tablet) classes.push('sm:hidden md:block');
  if (!desktop) classes.push('md:hidden');
  return <div className={classes.join(' ')}>{children}</div>;
}
