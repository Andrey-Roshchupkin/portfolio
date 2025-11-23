import { useRef, useState } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, image: File | null) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    onSend(inputText.trim(), selectedImage);
    setInputText('');
    removeImage();
    
    // Return focus to textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#d1d9de] dark:border-[#30363d] p-4">
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-lg max-h-[100px] max-w-[100px] object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-[#57606a] text-white rounded-full p-1 hover:bg-[#24292f] dark:bg-[#7d8590] dark:hover:bg-[#e6edf3]"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-[#57606a] hover:text-[#24292f] dark:text-[#7d8590] dark:hover:text-[#e6edf3] transition-colors rounded-md hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]"
          aria-label="Attach image"
          disabled={isLoading}
        >
          <ImageIcon size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[44px] max-h-[200px] px-3 py-2 rounded-md border border-[#d1d9de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-[#24292f] dark:text-[#e6edf3] resize-none focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-[#1f6feb]"
          disabled={isLoading}
          rows={5}
        />
        <button
          onClick={handleSend}
          disabled={(!inputText.trim() && !selectedImage) || isLoading}
          className="inline-flex items-center justify-center p-2 rounded-md bg-[#f6f8fa] text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

