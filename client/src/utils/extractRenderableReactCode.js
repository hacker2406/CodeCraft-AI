/**
 * Removes import/export lines and ensures the code is renderable.
 */
export function extractRenderableReactCode(code) {
  // Remove import/export statements and <style jsx> blocks
  let sanitized = code
    .replace(/^\s*import.*$/gm, "")
    .replace(/^\s*export\s+default.*$/gm, "")
    .replace(/^\s*export\s+{.*}$/gm, "")
    .replace(/<style\s*jsx>{`[\s\S]*?`}\s*<\/style>/gm, "")
    .trim();

  // If code contains a JSX tag outside a function, assume it's renderable
  const jsxRenderMatch = sanitized.match(/^[^]*<([A-Z][\w]*)\s*\/>[^]*$/m);
  if (jsxRenderMatch) {
    return sanitized;
  }

  // If only a function component definition, wrap in an arrow function and render
  const funcCompMatch = sanitized.match(/function\s+([A-Z][\w]*)\s*\(/);
  if (funcCompMatch) {
    const compName = funcCompMatch[1];
    return `() => {
      ${sanitized}
      return <${compName} />;
    }`;
  }

  // If only an arrow function component definition, wrap in an arrow function and render
  const arrowCompMatch = sanitized.match(/const\s+([A-Z][\w]*)\s*=\s*(?:\([^\)]*\)|[^\s=]+)\s*=>\s*{/);
  if (arrowCompMatch) {
    const compName = arrowCompMatch[1];
    return `() => {
      ${sanitized}
      return <${compName} />;
    }`;
  }

  // Otherwise, return code as is
  return sanitized;
}