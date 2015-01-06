#!/bin/bash

VERSION="$(node server/version)"
BRANCH="$VERSION-release"
ZIP="gitana-javascript-driver-$VERSION.zip"

echo Deploying version $VERSION


#
# SETUP
#

# switch to master branch
# create a local branch <version>-release
git checkout master
git checkout -b $BRANCH




#
# STEP 1: BUILD DRIVER, JSDOCS AND DEPLOY TO CDN
#

# build driver
ant clean package

# build jsdoc
grunt jsdoc

# add the ./dist directory to the commit
git add dist -f

# commit changes to local branch
git commit -m "gitana driver release build $VERSION"




#
# STEP 2: PUBLISH DISTRIBUTION FILES TO CDN
#

# push to S3
grunt aws_s3

# invalidate cloudfront (CDN)
#grunt invalidate_cloudfront



#
# STEP 3: TAG REPO FOR BOWER
#

# create a tag
git tag $VERSION

# push the tag
git push origin $VERSION



#
# STEP 4: NPM Publish
#
sh npmjs.sh


#
# TEARDOWN
#

# delete local branch
git checkout master
git branch -D $BRANCH

# cleanup
ant clean