interface StatusBadgeProps {
  status: 'Completed' | 'Pending' | 'Failed';
}

const statusStyles: Record<string, string> = {
  Completed: 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20',
  Pending: 'bg-amber-400/10 text-amber-400 ring-amber-400/20',
  Failed: 'bg-red-400/10 text-red-400 ring-red-400/20',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ring-1 ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
