#!/bin/sh

# 実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
if [ -e ./gulpfile.js ]; then
  rm -r ./gulpfile.js
  echo "gulpfile.jsを削除しました"
fi
cp ../gulpfile.js ./gulpfile.js
echo "gulpfile.jsのコピーが完了しました"

if [ -e ./lib/ ]; then
  rm -r ./lib/
  echo "libを削除しました"
fi
cp -r ../lib/ ./lib/
echo "libのコピーが完了しました"
