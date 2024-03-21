#!/bin/bash
cd ${0%/*}

echo rsync to private p5videoKit folder
echo "!!@ Disabled"
exit

delete=--delete
test=
verbose=
test=--dry-run
verbose=v

excludes="--exclude-from to-public-exclude.txt"

source=../

destRepo=p5videoKit
rpath=../../$destRepo

echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rpath"
rsync -razO$verbose $excludes $delete $test "$source/" "$rpath/"
