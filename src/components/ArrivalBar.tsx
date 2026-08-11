export type ArrivalBarProps = {
  readonly countdown: string;
};

export function ArrivalBar({ countdown }: ArrivalBarProps) {
  return (
    <div className="arrival-bar">
      <span className="arrival-bar__brand">For Naima</span>
      <span aria-live="polite" className="arrival-bar__countdown">{countdown}</span>
    </div>
  );
}
