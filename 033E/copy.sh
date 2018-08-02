#!/bin/sh

# 実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
rm -r ./gulpfile.js
cp -r ../gulpfile.js ./gulpfile.js
echo "gulpfile.jsのコピーが完了しました"

rm -r ./lib/
cp -r ../lib/ ./lib/
echo "libのコピーが完了しました"
