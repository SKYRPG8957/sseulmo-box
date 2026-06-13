export function countText(value: string) {
  const normalizedLines = value ? value.split(/\r\n|\r|\n/) : [];
  const words = value.trim() ? value.trim().split(/\s+/).filter(Boolean) : [];

  return {
    chars: value.length,
    charsNoSpaces: value.replace(/\s/g, "").length,
    words: words.length,
    lines: normalizedLines.length,
    bytes: new TextEncoder().encode(value).length
  };
}
