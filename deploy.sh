#!/bin/bash

COMMITLOG=`git log --pretty=format:"%s" -1 | grep ''`
mv dist/CNAME backup
mv dist/.git backup
npm run generate
mv backup/CNAME dist
mv backup/.git dist
cd dist
git add .
git commit -m "$COMMITLOG"
git push --force
cd ..
