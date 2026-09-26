import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "../src/App";

/** Render a route after all Suspense content has resolved for production HTML. */
export function renderRoute(pathname) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks = [];
    let renderError = null;
    let renderer;

    output.on("data", (chunk) => chunks.push(chunk));
    output.once("error", reject);
    output.once("end", () => {
      if (renderError) return reject(renderError);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    renderer = renderToPipeableStream(
      <StaticRouter location={pathname}><App /></StaticRouter>,
      {
        onAllReady() {
          renderer.pipe(output);
        },
        onError(error) {
          renderError ||= error;
        },
        onShellError(error) {
          reject(error);
        },
      },
    );
  });
}
