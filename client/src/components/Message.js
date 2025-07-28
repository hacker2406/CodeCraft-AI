"use client";
import { extractCodeBlocks } from "@/utils/extractCodeBlocks";
import { extractRenderableReactCode } from "@/utils/extractRenderableReactCode";
import CodePreview from "./CodePreview";
import LivePreview from "./LivePreview";
import ReactLivePreview from "./ReactLivePreview";
import React from "react";

const Message = React.memo(function Message({ message }) {
  const codeBlocks = extractCodeBlocks(message.content);

  // Determine if this is a user or assistant message
  const isUser = message.role === "user";

  // Helper: Heuristically detect React component code
  const isProbablyReactComponent = (code) => {
    // Looks for function/arrow function components or export default with JSX
    return (
      /export\s+default\s+\w+/.test(code) ||
      /const\s+\w+\s*=\s*\(?.*\)?\s*=>\s*{/.test(code) ||
      /function\s+\w+\s*\(.*\)\s*{/.test(code)
    );
  };

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        isUser
          ? "bg-blue-900 text-blue-100 mr-4 self-end"
          : "bg-gray-800 text-gray-100 mr-auto self-start"
      }`}
      style={{ maxWidth: "80%" }}
    >
      {/* Render the message text without code blocks */}
      <div className="mb-2 whitespace-pre-line">
        {message.content.replace(/```[\s\S]*?```/g, "").trim()}
      </div>
      {/* Render all code blocks */}
      {codeBlocks.map((block, idx) => {
        // Normalize language to lowercase
        const lang = (block.lang || "").toLowerCase();
        const code = block.code.trim();

        // Robust JSX/React detection
        const isJSX =
          lang === "jsx" ||
          lang === "tsx" ||
          (!lang && isProbablyReactComponent(code));

        // Robust HTML detection
        const isHTML =
          lang === "html" ||
          (!lang && code.startsWith("<") && code.endsWith(">"));

        if (isJSX) {
          return (
            <div key={idx} className="my-2">
              <ReactLivePreview code={extractRenderableReactCode(code)} />
            </div>
          );
        } else if (isHTML) {
          return (
            <div key={idx} className="my-2">
              <LivePreview code={code} />
              <CodePreview code={code} language="html" />
            </div>
          );
        } else {
          return (
            <div key={idx} className="my-2">
              <CodePreview code={code} language={lang || "jsx"} />
            </div>
          );
        }
      })}
    </div>
  );
});

export default Message;