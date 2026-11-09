/**
 * Bumps the patch version and keeps the two package.json files in step.
 *
 * The root package (gitanajs) and the Node package (node/package.json, published
 * to npm as "gitana") are released together and must carry the same version.
 *
 * Usage: node build/bump.mjs [major|minor|patch]   (default: patch)
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RELEASES = ["major", "minor", "patch"];

const release = process.argv[2] || "patch";

if (!RELEASES.includes(release))
{
    console.error("usage: node build/bump.mjs [" + RELEASES.join("|") + "]");
    process.exit(1);
}

var bump = function(version, release)
{
    var parts = version.split("-")[0].split(".").map(Number);

    if (parts.length !== 3 || parts.some(isNaN))
    {
        throw new Error("cannot parse version \"" + version + "\"");
    }

    if (release === "major") return (parts[0] + 1) + ".0.0";
    if (release === "minor") return parts[0] + "." + (parts[1] + 1) + ".0";

    return parts[0] + "." + parts[1] + "." + (parts[2] + 1);
};

// the root package.json is the source of truth for the version
const rootPath = path.join(rootDir, "package.json");
const nodePath = path.join(rootDir, "node", "package.json");

const rootSource = await readFile(rootPath, "utf8");
const nodeSource = await readFile(nodePath, "utf8");

const current = JSON.parse(rootSource).version;
const next = bump(current, release);

// rewrite just the version line so the rest of the file - key order, indentation,
// trailing newline - is left exactly as it was
var setVersion = function(source, version)
{
    var replaced = source.replace(/("version"\s*:\s*")[^"]*(")/, "$1" + version + "$2");

    if (replaced === source)
    {
        throw new Error("no \"version\" field found");
    }

    return replaced;
};

await writeFile(rootPath, setVersion(rootSource, next));
await writeFile(nodePath, setVersion(nodeSource, next));

console.log(current + " -> " + next);
console.log("  package.json");
console.log("  node/package.json");
