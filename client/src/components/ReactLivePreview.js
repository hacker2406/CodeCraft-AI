"use client";
import React, { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

// Memoize the component to avoid rerendering unless 'code' changes
const ReactLivePreview = React.memo(function ReactLivePreview({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <div className="my-2 border border-gray-700 rounded-lg overflow-hidden bg-black">
      <LiveProvider code={code} scope={{ React, useState }}>
        <div className="p-2 bg-white text-black rounded-t max-h-[600px] overflow-auto">
          <LivePreview />
        </div>
        <LiveError className="text-red-500 p-2" />
        <div className="relative bg-gray-900 rounded-b">
          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="m-2 px-2 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <LiveEditor className="bg-gray-900 text-white p-2 text-sm" />
        </div>
      </LiveProvider>
    </div>
  );
});

export default ReactLivePreview;