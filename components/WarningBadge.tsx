interface WarningBadgeProps {
  warnings: string[];
}

export function WarningBadge({ warnings }: WarningBadgeProps) {
  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {warnings.map((warning) => (
        <div key={warning} className="inline-flex items-center gap-1 text-xs text-[#ffc107]">
          <span aria-hidden="true">⚠</span>
          <span>{warning}</span>
        </div>
      ))}
    </div>
  );
}
