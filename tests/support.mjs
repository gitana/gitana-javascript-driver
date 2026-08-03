/**
 * Everything the test files in tests/js need.
 *
 * Importing this loads the built driver, points it at the configured server and
 * installs the Node shims for XMLHttpRequest and web storage.
 */

export { Gitana, Chain } from "./node/support/driver.mjs";
export { GitanaTest } from "./node/support/gitana-test.mjs";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { installWebStorage } from "./node/support/storage.mjs";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "files");

// how long a test may go without calling start() before it is treated as stalled
const STALL_MS = Number(process.env.GITANA_TEST_STALL_MS || 60000);

/**
 * Runs an asynchronous test body and guarantees it settles.
 *
 * These tests only ever wire up success callbacks: when a driver operation fails,
 * the chain stops, start() is never called and the returned promise is orphaned.
 * Node then sees an empty event loop, reports "Promise resolution is still pending
 * but the event loop has already resolved" and - worse - cancels every test still
 * queued behind it, so one dead end takes out the rest of the run.
 *
 * The watchdog timer below keeps the event loop occupied, so a stalled test fails
 * on its own and the run carries on.
 *
 * The body is called with a fresh object as `this`, giving each test a scratch
 * namespace to hang state on across driver callbacks:
 *
 *     return guard(t, function(start) {
 *         var test = this;
 *         ...
 *         this.createGroup(...).then(function() { test.group1 = this; });
 *
 * QUnit used to supply its per-test testEnvironment object here, so this keeps
 * that idiom working.
 */
export function guard(t, body)
{
    return new Promise(function(resolve, reject) {

        var timer = setTimeout(function() {
            reject(new Error(
                "test stalled: start() was never called within " + STALL_MS + "ms - " +
                "a driver operation most likely failed and the test has no failure callback"
            ));
        }, STALL_MS);

        var start = function() {
            clearTimeout(timer);
            resolve();
        };

        try
        {
            body.call({}, start);
        }
        catch (e)
        {
            clearTimeout(timer);
            reject(e);
        }
    });
}

/** Reads a fixture from tests/files. Replaces the $.ajax call this once used. */
export function loadFixture(name, callback)
{
    callback(fs.readFileSync(path.join(fixtures, name), "utf8"));
}

// lets tests that select the driver's "local" or "session" storage exercise those
// paths instead of silently falling back to memory
installWebStorage();
