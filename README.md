# buddy-theme

## 概要
1. ACRE-themeのコンパイル前のソースコード管理
2. CSSの単体テスト
3. SASSのコンパイル
のためのリポジトリです。

## 事前準備

### node.jsのインストール
  - https://nodejs.org/ja/にアクセス
  - 推奨版をダウンロード
  - インストール
  - インストールを確認する。ターミナルを開いて`node -v`と、`npm -v`でバージョン数が表示されればOK

### 関連ファイルの配置
テスト対象のテーマ、部品（htmlテンプレート, meta.json）のファイルは、ローカルリポジトリから取得します。

#### ローカルリポジトリの準備
以下のリポジトリをローカルにクローンしてください。
- https://github.com/wmssystem/ACRE-theme

ACRE-themeをbuddy-themeと同じフォルダ内に配置してください。

#### テスト対象のブランチに変更
ACRE-theme, buddy-themeをそれぞれテスト対象のブランチがチェックアウトされた状態にしてください。

#### 初回のセットアップ

1. ディレクトリの移動（031の場合）
```sh
$ cd （buddy-theme-toolsを配置した場所）/sample/031
```

2. 共通ファイルの取得
```sh
$ npm run copy
```

3. packageのインストール
```sh
$ npm install
```

4. CSSのコンパイル
```sh
$ npm run update-css
```

5. StyleGuide(aigis)の初期化とテストデータ作成
```sh
$ npm run update-parts
```

## ツールの使い方

### ディレクトリの移動（031の場合）
```sh
$ cd （buddy-theme-toolsを配置した場所）/sample/031
```

### 起動
```sh
$ npm start
```
起動中は部品、CSSの更新が自動で反映されます

### 停止
```
Ctrl + C
```

### コマンド一覧の表示
```sh
$ npm run
```

## こんな時には？

### npm startしていない時にCSSを修正した

```sh
$ npm run update-css
```

### npm startしていない時にJSON/HTMLを修正した

```sh
$ npm run update-parts
```

※sassdocが更新された場合追加で実行する
```sh
$ npm run update-sassdoc
```

### Starting 'make-aigis'...の後にエラーが表示されている

```sh
$ npm run make-aigis
```

### Starting 'aigis'...の後にエラーが表示されている

```sh
$ npm run aigis
```


## 関連資料

- [単体テスト仕様書マスタ](https://docs.google.com/spreadsheets/d/1SaKg4pTiquk32kw9qauzWWrDsZcNiGSL83G8yULXJIE/edit#gid=852993701)
- [機能／デザイン仕様一覧](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)

## システム仕様
```
.
├── aigis-markdown
│   ├── abstract_aigis_markdown.js
│   ├── aigis_inner_markdown.js
│   ├── aigis_yaml.js
│   └── unittest.js
├── btool-settings
│   ├── buddy-parts-testcases.json
│   ├── function-design.json
│   └── parts-categories.json
├── make_aigis.js
├── make_all-datajsons.js
├── make_datajson.js
├── make_html.js
├── schemas
│   ├── dataSchema.json
│   └── metaSchema.json
└── utils
    ├── breadcrumbs001.json
    ├── buddy-parts-design.json
    ├── buddy-parts-functions.js
    ├── buddy-parts-functions.json
    ├── data-json-generator.js
    ├── formTableAll.json
    ├── sideMenu001.json
    └── utils.js
```

### btool-settings
buddy-theme-toolsの設定情報等を格納する

#### buddy-parts-testcases.json
テストケース情報を設定しているファイル

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/16pk-IFDGNxv7gjVvLemW0kNlOwpuLdcpc8zJYL81N6Y/edit#gid=318273719)

単体テスト > make buddy parts testcases json

#### function-design.json

標準機能仕様、ブロック個別機能仕様を一覧で管理する情報

[取得スクリプト](https://script.google.com/a/wmshome.net/d/1yw1TXWMZCW3-n5IJzYfirvsKSqnuWVVPKZuNhecPf3nQkS6VsKdl8k8k/edit?usp=drive_web)

#### parts-categories.json

部品とCSSブロックのマッピング情報

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/1kkHsXTtCFVtYcj0ZwbPDukPQkPrzJGrIrVOWGBUqeIg/edit#gid=0)

単体テスト > make parts categories json

### schemas
dataJson, metaJsonのスキーマ情報

### utils

#### buddy-parts-functions.json

機能初期値、テスト値とブロックの対応状況の定義情報

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/1kkHsXTtCFVtYcj0ZwbPDukPQkPrzJGrIrVOWGBUqeIg/edit#gid=0)

単体テスト > make buddy parts functions json


#### buddy-parts-design.json

デザイン仕様を確認するための機能とマッピング

手動で作成

#### ブロック専用jsonファイル

ブロック固有の事情で必要になるファイル
手動で作成

- breadcrumbs001.json
- formTableAll.json
- sideMenu001.json
