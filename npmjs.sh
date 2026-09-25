#!/bin/bash
#
# Builds and publishes the Node package in ./node to npm as "gitana".
#
# node/lib is a build artifact: it is gitignored, populated here, and only
# committed on the <version>-release branch that release.sh creates.
#
# Called by release.sh, but safe to run on its own.
#
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT"

npm run build

# the driver build is what the Node package ships
mkdir -p "$ROOT/node/lib"
cp "$ROOT/dist/gitana.js" "$ROOT/node/lib/gitana.js"
cp "$ROOT/dist/gitana.min.js" "$ROOT/node/lib/gitana.min.js"

cd "$ROOT/node"

npm install

npm publish

cd "$ROOT"
