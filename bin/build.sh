#!/bin/bash
cd ${0%/*}

# build without incrementing build number:
# bin/build.sh --dev

# Install npm if needed for node build scripts
#
dest=../node
if [ ! -e "$dest/node_modules" ]; then
  pushd $dest > /dev/null
  npm install
  popd > /dev/null
fi

# Copy src files to build
excludes="--exclude .DS_Store  --exclude external/media"
delete=--delete
test=
# test=--dry-run
verbose=
# verbose=v
source=../src
rdest=../build
rsync -razO$verbose $excludes $delete $test "$source/" "$rdest/"

# Process files in build to expand build version etc.
# select files are written to src and build so that 
# src/index.html can used for live server
node ../node/build.js "$@"

