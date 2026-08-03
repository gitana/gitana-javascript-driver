/**
 * Configuration for the integration suite.
 *
 * Credentials come from tests/gitana.json (git-ignored), the base URL from
 * GITANA_BASE_URL or http://localhost:8080. If the config file is absent, the
 * integration suite skips rather than fails, so `npm test` stays green for anyone
 * without a server.
 */

import fs from "node:fs";
import path from "node:path";
import { root } from "./driver.mjs";

export const configPath = path.join(root, "tests", "gitana.json");

export const baseURL = process.env.GITANA_BASE_URL || "http://localhost:8080";

export const credentials = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf8"))
    : null;

export const isConfigured = Boolean(
    credentials && credentials.clientKey && credentials.clientSecret &&
    credentials.username && credentials.password
);
