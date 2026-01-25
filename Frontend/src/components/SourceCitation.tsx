import { FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

type Source = {
  category: string;
  filename: string;
  snippet: string;
};

type SourceCitationProps = {
  sources: Source[];
};

export default function SourceCitation({ sources }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  // Remove duplicates based on filename
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.filename === source.filename)
  );

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span className="font-medium">Sources ({uniqueSources.length})</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {uniqueSources.map((source, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-2">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {source.category}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {source.filename}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {source.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
