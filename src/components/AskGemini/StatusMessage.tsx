import type { WebAIStatus } from './types';

interface StatusMessageProps {
  status: WebAIStatus;
}

export function StatusMessage({ status }: StatusMessageProps) {
  return (
    <div className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#24292f] dark:text-[#e6edf3]">
        {status.message}
      </h2>
      <div className="space-y-2">
        <p className="text-sm text-[#57606a] dark:text-[#7d8590] mb-4">
          To use Ask Gemini, you need to meet the following requirements:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-[#57606a] dark:text-[#7d8590]">
          {status.instructions.map((instruction, index) => (
            <li key={index} className={instruction === '' ? 'list-none my-2' : ''}>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

