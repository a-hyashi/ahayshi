#!/bin/bash

git clone git@github.com:wmssystem/ACRE-theme.git ../ACRE-theme

for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
  cd ${theme##*/}
  cp ../copy.sh ./copy.sh
  ./copy.sh
  gulp build
  gulp output
  cd ../
done

cd ../ACRE-theme

d=`date '+%Y%m%d%H%M%S'`

git config --global user.email "system@akibare.net"
git config --global user.name "syanai-deploy"
git checkout -b "circleCI/${d}"
git add .
git commit -m "buddy-themeから出力"
git push origin "circleCI/${d}"
