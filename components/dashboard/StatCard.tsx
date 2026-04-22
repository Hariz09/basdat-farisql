type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex h-full flex-col justify-between p-6 sm:p-8">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-black/50">
          {label}
        </p>
        <h3 className="mt-4 font-serif text-4xl font-black tracking-tight text-black sm:text-5xl">
          {value}
        </h3>
      </div>
      
      {hint && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-black/40">
          {hint}
        </p>
      )}
    </div>
  );
}