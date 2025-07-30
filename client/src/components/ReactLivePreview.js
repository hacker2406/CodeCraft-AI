"use client";
import React, { useState, useEffect, useRef } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const ReactLivePreview = React.memo(function ReactLivePreview({ code }) {
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    // Inject Tailwind CSS into the preview container
    if (previewRef.current) {
      const existingLink = previewRef.current.querySelector('link[href*="tailwindcss"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.tailwindcss.com';
        previewRef.current.appendChild(link);
      }
    }
  }, []);

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
        <div 
          ref={previewRef}
          className="p-2 bg-white text-black rounded-t max-h-[600px] overflow-auto"
        >
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