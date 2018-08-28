# buddy-theme

## 概要
1. ACRE-themeのコンパイル前のソースコード管理
2. CSSの単体テスト
3. SASSのコンパイル  
のためのリポジトリです。

<br>

## 構築する環境
以下の環境になっていればスタイルガイドを起動できます。手順はこの環境を構築するための操作です。  
もしツールが動かなかったりエラーが表示される場合は、以下の環境が整っていることを確認してください。

1. Mac内でDockerが起動している
2. 以下のフォルダ構成になっている

```
buddy-theme
├── 031（各テーマ）
│   ├── copy.sh
│   ├── gulp_config.json
│   ├── gulpfile.js
│   ├── lib
│   │   └── ･･･
│   └── styleguide_assets
│   │   └── ･･･
│   └── unittest
│       └── ･･･
├── btool-settings
│   ├── buddy-parts-testcases.json
│   ├── function-design.json
│   └── parts-categories.json
├── copy.sh
├── Dockerfile
├── _docker-compose.yml
├── docker-compose.yml
├── gulpfile.js
├── package.json
├── package-lock.json
└── node_modules
    └── ･･･
```

<br>

## 全体で一度だけ実行すること

### Dockerとnpmのインストール
1. アカウントを作成し、Dockerをインストールする  
https://qiita.com/scrummasudar/items/750aa52f4e0e747eed68

2. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOKです

3. 以下のコマンドを実行する

```sh
$ cd （buddy-themeフォルダの場所）
$ cp _docker-compose.yml docker-compose.yml
$ docker-compose run base npm install
```
buddy-themeフォルダ内にdocker-compose.ymlファイルとnode_modulesフォルダがあればOKです

### 関連ファイルの配置
以下のリポジトリをローカルにクローンし、buddy-themeと同じフォルダ内に配置してください。
- https://github.com/wmssystem/ACRE-theme

### テスト対象のブランチに変更
ACRE-theme, buddy-themeをそれぞれテスト対象のブランチにチェックアウトされた状態にしてください。

<br>

## テーマごとに一度だけ実行すること

1. 作業場所の変更  
テキストエディタで、buddy-theme内の`docker-compose.yml`ファイルを開き、以下の箇所のテーマ名を変更する
**_docker-compose.yml（アンダーバー付き）の方じゃないので注意**  
この操作で設定したフォルダ内でツールが実行されるようになります

``` yaml
working_dir: /buddy-theme/031/
```

2. 共通ファイルの取得
```sh
$ docker-compose run base cp ../copy.sh ./copy.sh
```

```sh
$ docker-compose run base ./copy.sh
```
先に設定したテーマフォルダ内にgulpfile.jsファイルとlibフォルダがあればOKです

3. StyleGuide(aigis)の初期化とテストデータ作成
```sh
$ docker-compose run base gulp update-parts --max_old_space_size=8192
```
先に設定したテーマ/unittest/parts/フォルダに部品名.mdといったファイルが複数存在していればOKです

<br>

## ツールの使い方

### 起動
1. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOKです

2. 以下のコマンドを実行する
```sh
$ cd （buddy-themeフォルダの場所）
$ docker-compose up
```
CSSの更新は自動で反映されます

以下のメッセージが表示された場合は`y`を押してください
```sh
Continue with the new image? [yN]
```

### 表示
```sh
[Browsersync] Serving files from:
```

が表示されたら  
http://localhost:3000
を開いてください  
クロスブラウザテストで他の端末から接続する場合は  
http://（PCのIP）:3000
です

#### 参考
MacのIPの調べ方  
https://pc-karuma.net/mac-ip-address/

### 停止
```
Ctrl + C
```

### 本番用CSSの出力
```sh
$ docker-compose run base gulp build
```

### sasslintでコーディングスタイルのチェック
```sh
$ docker-compose run base gulp sasslint
```
**partsディレクトリ配下しかチェックしないので注意**

<br>

## こんな時には？

### JSON/HTMLを修正した

```sh
$ docker-compose run base gulp update-parts --max_old_space_size=8192
```

### sassdocが更新された
```sh
$ docker-compose run base gulp update-sassdoc
```

### 動作が遅くなってきた
Dockerを再起動するか、以下のコマンドを実行してください
```sh
$ docker-compose down
```

### buddy-themeが更新された

  更新を取り込んだあと、

> テーマごとに一度だけ実行すること

を再実行してください

<br>

## リポジトリの保守

### 新しいテーマを作る場合
他のテーマを参考に同じ構造を再現し、以下のファイルをテーマごとの値に修正してください

 - gulp_config.json
 - devstuff/aigis_config.yml

### docker-compose.ymlを変更する場合
ユーザーがテーマ名を変更するため、gitignoreに含めています  
`_docker-compose.yml`を複製して使うようにしているので、このファイルを変更してください

<br>

## 関連資料

- [単体テスト仕様書マスタ](https://docs.google.com/spreadsheets/d/1SaKg4pTiquk32kw9qauzWWrDsZcNiGSL83G8yULXJIE/edit#gid=852993701)
- [機能／デザイン仕様一覧](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)

<br>

## システム仕様

```
lib
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
buddy-themeの設定情報等を格納する

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
