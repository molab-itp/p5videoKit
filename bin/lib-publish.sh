#!/bin/bash
cd ${0%/*}
cd ..

# publish lib to npm

quiet=--quiet

# bin/build.sh --prod $quiet 

git add . 
git commit $quiet -m "publish"
git push $quiet

npm version patch

npm run build > docs/publish.txt

npm publish 2>> docs/publish.txt

git push $quiet

# cat notes/publish.txt

