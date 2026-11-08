// Gera assets/banner-claro.svg e assets/banner-escuro.svg (marinho e creme, como o portfólio).
// Rodar: node tools/banner.mjs
import { writeFileSync } from "node:fs";

const W = 1200, H = 360;
const temas = {
  claro: { fundo: "#f3ead8", texto: "#13234a", suave: "#4a5878", linha: "#13234a", fraco: "#ddd0b6" },
  escuro: { fundo: "#0f1c3f", texto: "#f3ead8", suave: "#c3bba9", linha: "#f3ead8", fraco: "#22366a" },
};

// Globo de rede (lembra o rede.js do portfólio): meridianos, paralelos, nós e rotas.
const cx = 1000, cy = 180, r = 132;
function globo(t) {
  const partes = [];
  partes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t.linha}" stroke-width="1.6"/>`);
  for (const k of [0.25, 0.55, 0.85]) {
    partes.push(`<ellipse cx="${cx}" cy="${cy}" rx="${(r * k).toFixed(1)}" ry="${r}" fill="none" stroke="${t.linha}" stroke-opacity=".35" stroke-width="1"/>`);
  }
  for (const y of [-0.66, -0.33, 0, 0.33, 0.66]) {
    const yy = cy + y * r, rx = r * Math.sqrt(1 - y * y);
    partes.push(`<ellipse cx="${cx}" cy="${yy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.16).toFixed(1)}" fill="none" stroke="${t.linha}" stroke-opacity=".35" stroke-width="1"/>`);
  }
  const nos = [[-70, -60], [52, -88], [96, 10], [18, 46], [-92, 30], [-24, 104], [64, 86]];
  const P = ([x, y]) => [cx + x, cy + y];
  const rotas = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [3, 6], [5, 3]];
  rotas.forEach(([a, b], i) => {
    const [x1, y1] = P(nos[a]), [x2, y2] = P(nos[b]);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 26;
    const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
    partes.push(`<path id="r${i}" d="${d}" fill="none" stroke="${t.linha}" stroke-width="1.4" stroke-dasharray="3 5"/>`);
  });
  for (const n of nos) {
    const [x, y] = P(n);
    partes.push(`<circle cx="${x}" cy="${y}" r="5" fill="${t.fundo}" stroke="${t.linha}" stroke-width="2"/>`);
  }
  // Pacotes viajando pelas rotas
  [[0, 4.2, 0], [2, 3.6, 1.2], [5, 5, 2.1], [6, 4.4, 0.6]].forEach(([i, dur, atraso]) => {
    partes.push(`<circle r="4" fill="${t.linha}"><animateMotion dur="${dur}s" begin="${atraso}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#r${i}"/></animateMotion></circle>`);
  });
  return partes.join("\n    ");
}

const fonte = "Archivo, 'Helvetica Neue', 'Segoe UI', Arial, sans-serif";
const mono = "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace";

function svg(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Arthur Medeiros: jogos e IA para a escola">
  <rect width="${W}" height="${H}" rx="18" fill="${t.fundo}"/>
  <g font-family="${mono}" font-size="15" letter-spacing="2.4" fill="${t.suave}">
    <text x="64" y="84">CIÊNCIA DA COMPUTAÇÃO · UNIPAMPA · ALEGRETE/RS</text>
  </g>
  <text x="60" y="176" font-family="${fonte}" font-size="92" font-weight="800" letter-spacing="-3.5" fill="${t.texto}">Arthur Medeiros</text>
  <text x="64" y="230" font-family="${fonte}" font-size="27" fill="${t.texto}">Faço jogos e IA para escolas no GamificaPampa</text>
  <text x="64" y="266" font-family="${fonte}" font-size="27" fill="${t.texto}">e pesquiso segurança em IoT no TRAP-IoT.</text>
  <line x1="64" y1="300" x2="760" y2="300" stroke="${t.fraco}" stroke-width="1.5"/>
  <g font-family="${mono}" font-size="14" letter-spacing="1.2" fill="${t.suave}">
    <text x="64" y="328" xml:space="preserve">AI Horizon Labs  ·  UNIPAMPA  ·  medeiros08.github.io</text>
  </g>
  <g>
    ${globo(t)}
  </g>
</svg>
`;
}

for (const [nome, t] of Object.entries(temas)) {
  writeFileSync(new URL(`../assets/banner-${nome}.svg`, import.meta.url), svg(t));
}
console.log("ok");
