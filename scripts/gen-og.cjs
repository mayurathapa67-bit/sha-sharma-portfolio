const fs = require("fs");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf7f2"/>
  <circle cx="950" cy="180" r="200" fill="#ff6b6b" opacity="0.16"/>
  <circle cx="300" cy="520" r="160" fill="#0d7377" opacity="0.14"/>
  <text x="80" y="300" font-family="Georgia, serif" font-size="92" fill="#1a1a1a">Esha Sharma</text>
  <text x="84" y="370" font-family="Georgia, serif" font-size="40" fill="#0d7377">Master Wordsmith &amp; Brand Voice Architect</text>
  <rect x="84" y="430" width="300" height="4" fill="#1a1a1a" opacity="0.2"/>
  <text x="84" y="500" font-family="monospace" font-size="22" fill="#1a1a1a" opacity="0.6" letter-spacing="4">MELBOURNE · KATHMANDU</text>
</svg>`;
fs.writeFileSync("public/og.svg", svg, "utf-8");
console.log("og.svg created");
