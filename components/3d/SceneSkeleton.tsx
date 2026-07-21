export default function SceneSkeleton({ label = "Loading scene" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/15 border-t-teal" />
        <span className="eyebrow">{label}</span>
      </div>
    </div>
  );
}
