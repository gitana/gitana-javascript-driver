/**
 * The tests that talk to a live Cloud CMS server, run headless.
 *
 * Requires tests/gitana.json and a reachable server (GITANA_BASE_URL, default
 * http://localhost:8080). Skips cleanly when no credentials are configured.
 *
 * These tests create real data - users, tenants, repositories - so point them at a
 * disposable instance.
 *
 * The file list and its order live in manifest.json. Order is significant: the
 * suite was written to run in sequence and some tests build on state left by
 * earlier ones, so the files are imported one at a time rather than discovered.
 * The only exclusions are the server-free tests, which run in unit.test.mjs.
 */

import { describe, it } from "node:test";
import { createRequire } from "node:module";
import { isConfigured, baseURL, configPath } from "../support/config.mjs";

const manifest = createRequire(import.meta.url)("./manifest.json");

if (!isConfigured)
{
    describe("integration", function() {
        it("skipped - no credentials", { "skip": "create " + configPath + " to run the integration suite" }, function() {});
    });
}
else
{
    console.log("integration target: " + baseURL);

    for (const name of manifest)
    {
        await import("../../js/" + name);
    }
}
