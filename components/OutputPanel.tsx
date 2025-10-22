
import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';

interface OutputPanelProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDisplayContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          <p>{error}</p>
        </div>
      );
    }
    if (output) {
      return (
        <pre className="whitespace-pre-wrap break-words text-gray-300">{output}</pre>
      );
    }
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Your result will appear here...</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 relative min-h-[200px] shadow-lg">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          disabled={!output || isLoading || !!error}
          className="p-2 rounded-md bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Copy to clipboard"
        >
          {copied ? 'Copied!' : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="h-full w-full font-mono text-sm">
        {getDisplayContent()}
      </div>
    </div>
  );
};

export default OutputPanel;
