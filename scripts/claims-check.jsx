import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "../src/App";

const ROUTES = ["/", "/creators", "/for-artists", "/business", "/invest", "/get-the-app", "/feedback", "/contact", "/privacy", "/terms", "/delete-account", "/child-safety"];

// Phrases the brief forbids outright. Matched against rendered page text.
const BANNED = [
  /per view/i, /earn (money )?for (every )?view/i, /paid to watch/i,
  /\bPOV\b/, /blockchain/i, /polygon/i, /\bNFTs?\b/i, /crypto/i, /web3/i, /\btokens?\b/i,
  /verified authentic/i, /cryptographic/i, /AI-proof/i, /proven real/i,
  /download on the app store/i, /get it on google play/i,
  /withdraw .{0,20}instantly/i, /instant withdrawal/i,
  /ad-supported/i, /advertise with us/i,
  /\bsavings\b/i, /(?<!no )guaranteed (earnings|returns|income)/i,
  /\be-money\b/i, /\bR\d[\d.,]* per month/i, /make R\d/i,
];

let hits = 0;
for (const r of ROUTES) {
  const html = renderToString(<StaticRouter location={r}><App /></StaticRouter>);
  const text = html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/\s+/g, " ");
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) { hits++; console.log(`VIOLATION ${r}: "${m[0]}" (${re})`); }
  }
}
console.log(hits ? `\n${hits} violation(s)` : "\nNo forbidden claims found across " + ROUTES.length + " pages");
if (hits) process.exitCode = 1;
