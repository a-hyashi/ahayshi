#!/bin/sh

# 実行ディレクトリが変わってしまうため、シンボリックリンクではなくコピーする
cp -r ../gulpfile.js gulpfile.js
echo "gulpfile.jsのコピーが完了しました"
cp -r ../lib/ lib/
echo "libのコピーが完了しました"
