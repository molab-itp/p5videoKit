#!/bin/bash
cd ${0%/*}

# setup external_media
# symbolic link from
#   src/external/media
# to
#   ../../../external_media

excludes="--exclude-from to-public-exclude.txt"

delete=--delete
test=
verbose=
# test=--dry-run
# verbose=v

start_time=`date +%s`

dest_path=../../external_media
if [ ! -e "$dest_path" ]; then
  host=jhtitp@jht1493.net
  siteroot=/home/bitnami/htdocs
  src_path="${siteroot}/external_media"
  src_host=$host:${src_path}
  echo mkdir $dest_path
  mkdir -p $dest_path
  # echo $verbose $delete $test
  echo -razO$verbose $excludes $delete $test
  echo "rsync from $src_host"
  echo "        to $dest_path"
  rsync -razO$verbose $excludes $delete $test "$src_host/" "$dest_path/"
fi

# Large media files access via symbolic link to outter directory
# external_media
#
dest=../src/external
if [ ! -e "$dest/media" ]; then
  echo "creating symbolic link to external_media"
  pushd $dest > /dev/null
  ln -s ../../../external_media media
  popd > /dev/null
fi

echo
echo install media lapse $(expr `date +%s` - $start_time) 


