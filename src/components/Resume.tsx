import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, FileText } from 'lucide-react';
import { getContent } from '../utils/content';

export function Resume() {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    getContent('resume').then(setContent);
  }, []);

  const handleCopy = async () => {
    if (!articleRef.current) return;
    
    const text = articleRef.current.textContent || articleRef.current.innerText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadMD = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SDET-AQA-Andrey-Roshchupkin.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    // In dev, files from public are served at root. In production, use base URL
    const pdfPath = import.meta.env.DEV 
      ? `${window.location.origin}/SDET-AQA-Andrey-Roshchupkin.pdf`
      : `${window.location.origin}${import.meta.env.BASE_URL}SDET-AQA-Andrey-Roshchupkin.pdf`;
    window.open(pdfPath, '_blank');
  };

  return (
    <section className="space-y-6">
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f6f8fa] px-4 py-2 text-sm font-medium text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d] relative w-[110px]"
        >
          {copied ? (
            <>
              <Check size={16} className="text-[#1a7f37] dark:text-[#3fb950]" />
              <span className="text-[#1a7f37] dark:text-[#3fb950]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownloadMD}
          className="inline-flex items-center gap-2 rounded-md bg-[#f6f8fa] px-4 py-2 text-sm font-medium text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d]"
        >
          <Download size={16} />
          Save MD
        </button>
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 rounded-md bg-[#f6f8fa] px-4 py-2 text-sm font-medium text-[#24292f] hover:bg-[#e1e4e8] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] transition-colors border border-[#d1d9de] dark:border-[#30363d]"
        >
          <FileText size={16} />
          View PDF
        </button>
      </div>
      <article 
        ref={articleRef}
        className="markdown-body prose prose-slate dark:prose-invert max-w-none"
      >
        <ReactMarkdown>{content || 'Loading...'}</ReactMarkdown>
      </article>
    </section>
  );
}

