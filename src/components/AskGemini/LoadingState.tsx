import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <section className="space-y-6" aria-label="Ask Gemini">
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin text-[#57606a] dark:text-[#7d8590]" size={24} />
      </div>
    </section>
  );
}

