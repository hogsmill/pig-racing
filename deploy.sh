#!/bin/bash

if [ "$1" == "-f" ]; then
  FORCE=true
fi

PORT=3010
PWD=`pwd`
APP=`basename $PWD`
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
else
  GIT1=`git pull | grep "error: Your local changes to the following files would be overwritten by merge:"`
  GIT2=`git pull | grep "package-lock.json"`
  if [ "$GIT1" != "" -a "$GIT2" != "" ]; then
    echo "Stashing"
    git stash
    git pull
  fi
fi

npm run build
rm /var/www/html/$APP/css/*
rm /var/www/html/$APP/js/*
cp -R dist/* /var/www/html/$APP
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill -9 $SERVER
  fi
  KEEP=`ps -ef | grep keep.sh | grep $PORT | awk {'print $2'}`
  if [ "$KEEP" != "" ]; then
    kill -9 $KEEP
  fi
fi
