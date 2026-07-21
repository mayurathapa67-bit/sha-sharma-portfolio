const fs = require("fs");
const path = require("path");

const files = [
  ["public/about.svg", "The writer", "#faf7f2", "#f3ece1", "#ff6b6b"],
  ["public/work/lumen-1.svg", "Lumen Money", "#f3ece1", "#e8c07d", "#0d7377"],
  ["public/work/lumen-2.svg", "A human pulse", "#e8c07d", "#faf7f2", "#ff6b6b"],
  ["public/work/marigold-1.svg", "Marigold & Co.", "#faf7f2", "#f3ece1", "#ff6b6b"],
  ["public/work/marigold-2.svg", "The menu", "#f3ece1", "#e8c07d", "#0d7377"],
  ["public/work/trail-1.svg", "Himalaya Trails", "#faf7f2", "#f3ece1", "#0d7377"],
  ["public/work/trail-2.svg", "The journal", "#e8c07d", "#faf7f2", "#ff6b6b"],
  ["public/blog/voice.svg", "Brand voice", "#f3ece1", "#e8c07d", "#0d7377"],
  ["public/blog/sentence.svg", "The sentence", "#faf7f2", "#f3ece1", "#ff6b6b"],
];

function svg(label, c1, c2, accent) {
  const safe = label.replace(/&/g, "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <circle cx="600" cy="250" r="160" fill="${accent}" opacity="0.18"/>
  <rect x="60" y="760" width="680" height="3" fill="#1a1a1a" opacity="0.12"/>
  <text x="60" y="840" font-family="Georgia, serif" font-size="46" fill="#1a1a1a" opacity="0.75">${safe}</text>
  <text x="60" y="892" font-family="monospace" font-size="20" fill="#0d7377" letter-spacing="4">ESHA SHARMA</text>
</svg>`;
}

for (const [p, label, c1, c2, accent] of files) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, svg(label, c1, c2, accent), "utf-8");
}
console.log("Created", files.length, "placeholders");
