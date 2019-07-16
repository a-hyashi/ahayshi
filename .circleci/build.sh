#!/bin/bash

git clone git@github.com:wmssystem/ACRE-theme.git ../ACRE-theme

# bash vertion3では連想配列が使えないため同じindexの値を取得して使う
pips=()
themes=()

for theme in `find . -type d -regex "./*[0-9][0-9][0-9][A-Z]*"` ; do
  cd ${theme##*/}
  cp ../copy.sh ./copy.sh
  ./copy.sh
  (gulp build && gulp output) &
  pips+=($!)
  themes+=( ${theme##*/} )
  cd ../
done

error_themes=()

for ((i = 0; i < ${#pips[@]}; i++)) ; do
  wait ${pips[$i]}
  if [ $? -ne 0 ]; then
    error_themes+=(${themes[$i]})
  fi
done

if [ ${#error_themes[@]} -ne 0 ] ; then
  echo "以下のテーマのビルドに失敗しました"
  echo "${error_themes[@]}"
  exit 1
fi

cd ../ACRE-theme

d=`date '+%Y%m%d%H%M%S'`

git config --global user.email "system@akibare.net"
git config --global user.name "syanai-deploy"
git checkout -b "circleCI/${d}"
git add .
git commit -m "buddy-themeから出力"
git push origin "circleCI/${d}"
