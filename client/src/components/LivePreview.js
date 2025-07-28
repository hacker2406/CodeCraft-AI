"use client";
import React from "react";

// Memoize the LivePreview component to avoid unnecessary rerenders
const LivePreview = React.memo(function LivePreview({ code }) {
  // Detect if code starts with <!DOCTYPE or <html
  const isFullHtml = /^\s*<!DOCTYPE|\s*<html/i.test(code);

  const srcDoc = isFullHtml
    ? code
    : `
      <html>
        <body style="margin:0;padding:0;">
              ${code}
        </body>
      </html>
    `;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 mb-4">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="300"
        className="bg-white block"
        style={{
          overflow: "auto",
          display: "block",
          border: "none",
          maxWidth: "100%",
        }}
      />
    </div>
  );
});

export default LivePreview;