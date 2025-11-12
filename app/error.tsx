"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[#0a0a0a] text-white">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-3">Something went wrong</h1>
        <p className="text-sm text-white/70 mb-4">{error.message}</p>
        {error.digest && (
          <p className="text-xs text-white/50 mb-4">Digest: {error.digest}</p>
        )}
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}















