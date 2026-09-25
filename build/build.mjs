/**
 * Builds the Gitana JavaScript Driver.
 *
 * The driver sources are plain scripts (not modules) that communicate through
 * globals in non-strict mode, so they must be concatenated in the order given by
 * manifest.json and then wrapped exactly once by the UMD wrapper. They cannot be
 * fed to a module bundler individually - module scope and strict mode would both
 * break them.
 *
 * Produces:
 *   dist/gitana.js
 *   dist/gitana.min.js
 *
 * node/lib is deliberately not touched here - it is populated by npmjs.sh at
 * release time and only committed on the release branch.
 */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import esbuild from "esbuild";

var buildDir = path.dirname(fileURLToPath(import.meta.url));
var rootDir = path.join(buildDir, "..");
var distDir = path.join(rootDir, "dist");

var read = function(relativePath)
{
    return readFile(path.join(rootDir, relativePath), "utf8");
};

var start = performance.now();

var manifest = JSON.parse(await readFile(path.join(buildDir, "manifest.json"), "utf8"));
var pkg = JSON.parse(await read("package.json"));

// concatenate the sources in manifest order
var sources = await Promise.all(manifest.map(read));
var script = sources.join("");

// wrap as a UMD module
var wrapper = await read("build/umd-wrapper.js");
var wrapped = wrapper
    .replace("/** BUILD_INSERT_NAME **/", "gitana")
    .replace("/** BUILD_INSERT_DEPENDENCIES **/", "[]")
    .replaceAll("/** BUILD_INSERT_VARIABLE_NAME **/", "Gitana")
    // a function replacer keeps $& and $' sequences in the sources from being
    // interpreted as substitution patterns
    .replace("/** BUILD_INSERT_SCRIPT **/", function() {
        return script;
    });

// stamp the version into the license header and the sources
var license = await read("js/license.js");
var banner = license.replaceAll("__VERSION__", pkg.version);
var bundle = (license + wrapped).replaceAll("__VERSION__", pkg.version);

// minify (the license is re-applied by hand so it survives)
var minified = await esbuild.transform(bundle, {
    "minify": true,
    "target": "es5",
    "legalComments": "none"
});

var minifiedBundle = banner + minified.code;

await rm(distDir, { "recursive": true, "force": true });
await mkdir(distDir, { "recursive": true });
await writeFile(path.join(distDir, "gitana.js"), bundle);
await writeFile(path.join(distDir, "gitana.min.js"), minifiedBundle);

var elapsed = Math.round(performance.now() - start);
console.log("gitana " + pkg.version + ": built " + manifest.length + " sources in " + elapsed + "ms");
console.log("  dist/gitana.js      " + bundle.length + " bytes");
console.log("  dist/gitana.min.js  " + minifiedBundle.length + " bytes");
