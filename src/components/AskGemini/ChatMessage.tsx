import type { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-[#0969da] text-white dark:bg-[#1f6feb]'
            : 'bg-[#f6f8fa] text-[#24292f] dark:bg-[#161b22] dark:text-[#e6edf3]'
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="User uploaded"
            className="mb-2 rounded max-w-full h-auto max-h-[300px]"
          />
        )}
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
    </div>
  );
}

