"use client";
import React, { useState } from "react";

function CodePreview({ code, language = "jsx" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-4 relative border border-gray-700">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-3 text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded hover:bg-gray-600"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto text-gray-200 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default React.memo(CodePreview);