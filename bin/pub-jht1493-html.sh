#!/bin/bash
cd ${0%/*}

# Publish html app to jht1493.net

excludes="--exclude-from to-public-exclude.txt"

delete=--delete
test=
verbose=
# test=--dry-run
verbose=v

start_time=`date +%s`

host=jhtitp@jht1493.net
siteroot=/home/bitnami/htdocs
homepage=head
rpath="${siteroot}/${homepage}"
rdest=$host:${rpath}

# Create directory for upload
ssh $host mkdir -p $rpath

source=../zoned/jht1493-head
# echo $verbose $delete $test
echo -razO$verbose $excludes $delete $test
echo "rsync from $source"
echo "        to $rdest"
rsync -razO$verbose $excludes $delete $test "$source/" "$rdest/"

echo
echo Lapse $(expr `date +%s` - $start_time) 
echo "open https://jht1493.net/${homepage}"


