#!/bin/bash
#
# Cuts a release.
#
#   - creates a <version>-release branch
#   - builds the driver and the API docs
#   - copies the driver into ./node and publishes it to npm as "gitana"
#   - commits dist and node/lib, tags, and pushes the branch and tag
#   - returns to master and deletes the local branch
#
# Bump the version first with `npm run bump`, which keeps package.json and
# node/package.json in step.
#
set -e

VERSION="$(node -p "require('./package.json').version")"
BRANCH="$VERSION-release"

echo "Releasing version $VERSION"

# refuse to start from a dirty tree - the release commit below adds everything
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    echo "working tree has uncommitted changes - commit or stash them first"
    exit 1
fi


#
# SETUP
#

git checkout master
git checkout -b "$BRANCH"


#
# STEP 1: BUILD DRIVER AND JSDOCS
#

npm run build
npm run docs


#
# STEP 2: BUILD AND PUBLISH THE NODE PACKAGE
#
# This copies dist into node/lib, so it has to happen before the commit below -
# node/lib is tracked, unlike dist.
#

sh npmjs.sh


#
# STEP 3: COMMIT THE RELEASE
#

# dist and node/lib are gitignored build artifacts - they are committed only here,
# on the release branch, so that the tag carries the exact published build
git add dist -f
git add node/lib -f
git add node/package.json

git commit -m "gitana driver release build $VERSION"


#
# STEP 4: TAG AND PUSH
#

git tag "$VERSION"

git push origin "$BRANCH"
git push origin "$VERSION"


#
# TEARDOWN
#

git checkout master
git branch -D "$BRANCH"

rm -rf dist
