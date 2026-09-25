/**
 * Publishes dist/ to the CDN.
 *
 * Replaces the former Grunt aws_s3 + invalidate_cloudfront tasks. Uploads the
 * build twice - once under the current version and once under "latest" - and then
 * invalidates CloudFront for both paths.
 *
 * Credentials come from ../settings/__aws.json, the same file the Grunt tasks read:
 *
 *   {
 *       "key": "...", "secret": "...", "region": "...", "bucket": "...",
 *       "cloudfrontDistributionIds": { "gitana-javascript-driver": "..." }
 *   }
 *
 * If that file is absent, the ambient AWS environment (profile, env vars, instance
 * role) is used instead.
 *
 * Usage: node build/publish.mjs [--dry-run]
 */

import { readFile, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const NAME = "gitana-javascript-driver";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const settingsPath = path.resolve(rootDir, "..", "settings", "__aws.json");

const dryRun = process.argv.includes("--dry-run");

var readSettings = async function()
{
    try
    {
        return JSON.parse(await readFile(settingsPath, "utf8"));
    }
    catch (e)
    {
        console.log("no " + settingsPath + " - falling back to the ambient AWS environment");
        return {};
    }
};

var run = function(args, env)
{
    console.log((dryRun ? "[dry run] " : "") + "aws " + args.join(" "));

    if (dryRun)
    {
        return;
    }

    var result = spawnSync("aws", args, { "stdio": "inherit", "env": env });

    if (result.error)
    {
        throw new Error("failed to run the aws CLI - is it installed? " + result.error.message);
    }
    if (result.status !== 0)
    {
        throw new Error("aws " + args[0] + " " + args[1] + " exited with code " + result.status);
    }
};

// dist must exist - publishing an empty prefix with --delete would wipe the CDN
try
{
    await access(path.join(distDir, "gitana.js"));
}
catch (e)
{
    console.error("dist/gitana.js is missing - run `npm run build` first");
    process.exit(1);
}

const pkg = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const settings = await readSettings();

if (!settings.bucket && !process.env.GITANA_CDN_BUCKET)
{
    console.error("no S3 bucket configured - set \"bucket\" in " + settingsPath + " or GITANA_CDN_BUCKET");
    process.exit(1);
}

const bucket = settings.bucket || process.env.GITANA_CDN_BUCKET;
const distributionId = (settings.cloudfrontDistributionIds || {})[NAME];

// only override the ambient credentials when the settings file supplies them
const env = Object.assign({}, process.env);
if (settings.key) env.AWS_ACCESS_KEY_ID = settings.key;
if (settings.secret) env.AWS_SECRET_ACCESS_KEY = settings.secret;
if (settings.region) env.AWS_DEFAULT_REGION = settings.region;

console.log("publishing " + pkg.name + " " + pkg.version + " to s3://" + bucket + "/" + NAME);

// --delete replaces the old clean-then-publish pair of tasks
for (const target of [pkg.version, "latest"])
{
    run(["s3", "sync", distDir, "s3://" + bucket + "/" + NAME + "/" + target, "--delete"], env);
}

if (distributionId)
{
    run([
        "cloudfront", "create-invalidation",
        "--distribution-id", distributionId,
        "--paths", "/" + NAME + "/" + pkg.version + "/*", "/" + NAME + "/latest/*"
    ], env);
}
else
{
    console.log("no CloudFront distribution configured for " + NAME + " - skipping invalidation");
}

console.log("done");
