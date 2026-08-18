import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../src/App";

const ROUTES = ["/", "/for-artists", "/get-the-app", "/feedback", "/contact", "/privacy", "/terms", "/nonsense"];

let failed = 0;
for (const r of ROUTES) {
  try {
    const html = renderToString(
      <StaticRouter location={r}><App /></StaticRouter>
    );
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`OK   ${r.padEnd(14)} ${html.length} bytes html, ${text.split(" ").length} words`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${r.padEnd(14)} ${e.message}`);
  }
}
console.log(failed ? `\n${failed} route(s) failed` : "\nAll routes rendered");
