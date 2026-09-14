#!/bin/bash
cd ${0%/*}

# Publish p5videoKit/demo html app to m.jht1493.net

# external/media
#   is managed manually
# excludes="--exclude .DS_Store --exclude .git --exclude node_modules --exclude external/media --exclude external/media-1"
# excludes="--exclude .DS_Store --exclude .git --exclude node_modules "
excludes="--exclude-from to-public-exclude.txt"

delete=--delete
test=
verbose=
# test=--dry-run
# verbose=v

start_time=`date +%s`

host=m.jht1493.net
homepage=p5videoKit/demo


echo
echo Lapse $(expr `date +%s` - $start_time) 
echo build_ver `cat ../src/gen/build_ver.txt`
echo "open https://m.jht1493.net/${homepage}"


