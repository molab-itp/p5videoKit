#!/bin/bash
cd ${0%/*}

# Publish p5VideoKit/demo html app to jht1493.net

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

host=jhtitp@jht1493.net
siteroot=/home/bitnami/htdocs
homepage=p5VideoKit/demo
rpath="${siteroot}/${homepage}"
rdest=$host:${rpath}

# Create directory for upload
ssh $host mkdir -p $rpath

# Remove server directory external/media, establish symbolic link later
# ssh $host rm -rf $rpath/external/media

source=../build
# echo $verbose $delete $test
echo -razO$verbose $excludes $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose $excludes $delete $test "$source/" "$rdest/"

source2="${source}/../stage"
rdest2="${rdest}/../stage"

verbose=v

echo "rsync from $source2"
echo "        to $rdest2"
rsync -razO$verbose $excludes $delete $test "$source2/" "$rdest2/"

# Symbolic link external/media to large media files folder
# ssh $host ln -s /home/bitnami/htdocs/a1/skt/assets $rpath/external/media

echo
echo Lapse $(expr `date +%s` - $start_time) 
echo build_ver `cat ../build/gen/build_ver.txt`
echo "open https://jht1493.net/${homepage}"


