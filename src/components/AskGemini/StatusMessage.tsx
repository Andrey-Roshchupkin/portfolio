import type { WebAIStatus } from './types';

interface StatusMessageProps {
  status: WebAIStatus;
}

export function StatusMessage({ status }: StatusMessageProps) {
  const messageId = `status-message-${status.message.replace(/\s+/g, '-').toLowerCase()}`;
  const descriptionId = `${messageId}-description`;
  
  return (
    <section 
      className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-6"
      role="status"
      aria-live="polite"
    >
      <h2 id={messageId} className="text-xl font-semibold mb-4 text-[#24292f] dark:text-[#e6edf3]">
        {status.message}
      </h2>
      <div className="space-y-2">
        <p id={descriptionId} className="text-sm text-[#57606a] dark:text-[#7d8590] mb-4" aria-describedby={messageId}>
          To use Ask Gemini, you need to meet the following requirements:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-[#57606a] dark:text-[#7d8590]" aria-labelledby={messageId}>
          {status.instructions.map((instruction, index) => (
            <li key={index} className={instruction === '' ? 'list-none my-2' : ''}>
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

