/**
 * Loads the built driver into Node and teaches it how to make HTTP calls here.
 *
 * Requiring the UMD bundle also publishes Gitana, Chain, Base and a stub window
 * onto globalThis - a side effect of the driver's non-strict global style. The
 * stub window is what lets tests call window.setTimeout under Node.
 */

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { XMLHttpRequest } from "./xhr.mjs";

const require = createRequire(import.meta.url);

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const distPath = path.join(root, "dist", "gitana.js");

if (!fs.existsSync(distPath))
{
    throw new Error("dist/gitana.js is missing - run `npm run build` first");
}

export const Gitana = require(distPath);

// Node has no XMLHttpRequest; route the driver through fetch
Gitana.HTTP_XHR_FACTORY = function() {
    return new XMLHttpRequest();
};

// Chain is published as a global by the bundle rather than hung off Gitana
export const Chain = globalThis.Chain;

export const testsDir = path.join(root, "tests", "js");
