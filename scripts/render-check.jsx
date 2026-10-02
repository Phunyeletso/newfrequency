import { renderRoute } from "./renderRoute";

const ROUTES = ["/", "/creators", "/for-artists", "/business", "/business/create", "/business/missions", "/business/campaigns", "/business/sales", "/business/review", "/invest", "/invest/dashboard", "/invest/conversation", "/account", "/account/settings", "/team", "/company", "/get-the-app", "/feedback", "/contact", "/privacy", "/terms", "/delete-account", "/child-safety", "/auth/confirmed", "/nonsense"];

let failed = 0;
async function main() {
  for (const r of ROUTES) {
    try {
      const html = await renderRoute(r);
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      console.log(`OK   ${r.padEnd(14)} ${html.length} bytes html, ${text.split(" ").length} words`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${r.padEnd(14)} ${e.message}`);
    }
  }
}
main().then(() => {
  console.log(failed ? `\n${failed} route(s) failed` : "\nAll routes rendered");
  if (failed) process.exitCode = 1;
});
