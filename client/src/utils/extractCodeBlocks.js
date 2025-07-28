export function extractCodeBlocks(text) {
  // Matches ```lang ... ``` or ``` ... ```
  const regex = /```(\w+)?\s*([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = regex.exec(text))) {
    blocks.push({
      lang: match[1] ? match[1].trim() : "",
      code: match[2].trim(),
    });
  }
  return blocks;
}