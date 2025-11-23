import type { InitState } from './types';

interface DownloadingStateProps {
  initState: InitState;
}

export function DownloadingState({ initState }: DownloadingStateProps) {
  return (
    <div className="rounded-lg border border-[#d1d9de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] p-6 min-h-[400px]">
      {initState === 'idle' && (
        <p className="text-sm text-[#57606a] dark:text-[#7d8590] text-center">
          Click "Download" to start
        </p>
      )}
      {initState === 'initializing' && (
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-[#24292f] dark:text-[#e6edf3]">
            Downloading model...
          </p>
          <div className="text-sm text-[#57606a] dark:text-[#7d8590] space-y-1">
            <p>Download time depends on your internet speed:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>50 Mbit/s: ~40 minutes</li>
              <li>100 Mbit/s: ~20 minutes</li>
              <li>200 Mbit/s: ~10 minutes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

