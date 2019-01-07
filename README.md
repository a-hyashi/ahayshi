# buddy-theme

## 概要
1. ACRE-themeのコンパイル前のソースコード管理
2. CSSの単体テスト
3. SASSのコンパイル  
のためのリポジトリです。

<br>
<br>

## 準備編

### 構築する環境
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
├── ssh
│   ├── devwork_rsa
│   └── sshconfig.json
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

### 全体で一度だけ実行すること

#### Dockerとnpmのインストール
1. アカウントを作成し、Dockerをインストールする  
https://qiita.com/scrummasudar/items/750aa52f4e0e747eed68

2. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOKです

3. 以下のコマンドを実行する

```sh
$ cd （buddy-themeフォルダの場所）
$ sed -e 's/theme-name/031/g' _docker-compose.yml > docker-compose.yml
$ docker-compose run base npm install
```
buddy-themeフォルダ内にdocker-compose.ymlファイルとnode_modulesフォルダがあればOKです

#### 関連ファイルの配置
以下のリポジトリをローカルにクローンし、buddy-themeと同じフォルダ内に配置してください。
- https://github.com/wmssystem/ACRE-theme

Googleドライブからdevwork_rsaとssh_config.jsonをダウンロードし、sshフォルダ内に配置してください。

<br>

#### テスト対象のブランチに変更
ACRE-theme, buddy-themeをそれぞれテスト対象のブランチにチェックアウトされた状態にしてください。

<br>

### テーマごとに一度だけ実行すること

```sh
$ ./init.sh （テーマ名）
```

指定したテーマフォルダ内に以下のファイルが作成されていればOKです
- gulpfile.js
- lib/
- .scss-lint.yml
- /unittest/parts/フォルダ内に部品名.md

<br>
<br>

## 利用編

### 起動
1. アプリのアイコンをクリックしDockerを起動する  
Macの上部にアイコンが表示されていればOKです

2. 以下のコマンドを実行する
```sh
$ cd （buddy-themeフォルダの場所）
$ ./up.sh （テーマ名）
```
CSSの更新は自動で反映されます

以下のメッセージが表示された場合は`y`を押してください
```sh
Continue with the new image? [yN]
```

起動中には、以下のことが自動で実行されます
- CSSとスタイルガイドの更新
- bPlacer.md（余白設定値表）の更新  
_bPlacer.scssを更新した場合は、bPlacer.mdも合わせてコミットしてください

<br>

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

<br>

### 停止
```
Ctrl + C
```

<br>

### 本番用CSSの出力
```sh
$ ./build.sh （テーマ名）
```
`ACRE-theme/acre/themes/`内にCSSが出力されます  
テーマ名を指定しない場合は全テーマ出力されます

```sh
$ ./build.sh
```

<br>

### sass-lintでコーディングスタイルのチェック
```sh
$ ./lint.sh （テーマ名）
```
**partsディレクトリ配下しかチェックしないので注意**

<br>

### CSSを開発環境にアップロード
```sh
$ ./upload.sh (テーマ名)
```

<br>

#### /buildの中身をACRE-themeにコピー
```bash
$ docker-compose run base gulp output
```

<br>

### こんな時には？

#### 以下のようなエラーが表示される
```sh
base_1  | events.js:165
base_1  |       throw er; // Unhandled 'error' event
base_1  |       ^
base_1  | Error: devStuff/src/parts/_033_lv2H.scss
base_1  | Error: Invalid CSS after "...r: $_textColor;": expected "}", was "&:hover "
base_1  |         on line 19 of devStuff/src/parts/_033_lv2H.scss
base_1  | >>       color: $_textColor;
```
SASSの構文エラーです。  
大抵の場合、メッセージ内にエラー内容、ファイル名、行数が書いてありますので、読んで修正してください。

#### JSON/HTMLを修正した

```sh
$ ./update-parts.sh （テーマ名）
```

#### sassdocが更新された
```sh
$ docker-compose run base gulp update-sassdoc
```

#### 動作が遅くなってきた
Dockerを再起動するか、以下のコマンドを実行してください
```sh
$ docker-compose down
```

#### buddy-themeが更新された

  更新を取り込んだあと、

> テーマごとに一度だけ実行すること

を再実行してください

<br>
<br>

## リポジトリの保守

### 新しいテーマを作る場合
1. フォルダの作成  
既存のテーマのフォルダを複製し、新しいテーマ名にリネームしてください  
**例**
031を複製して031Aのフォルダを作成する
1. devstuff/aigis_config.ymlの設定  
nameを新しいテーマ名に設定してください  
**例**
Theme 031A
1. gulp_config.jsonの設定  
html_templates_dirをACRE-theme内の対象テーマの部品があるフォルダに設定してください  
**例**
"../../ACRE-theme/acre/theme_materials/031/html_templates/"

<br>

### docker-compose.ymlを変更する場合
ユーザーがテーマ名を変更するため、gitignoreに含めています  
`_docker-compose.yml`を複製して使うようにしているので、このファイルを変更してください

<br>

### 関連資料

- [単体テスト仕様書マスタ](https://docs.google.com/spreadsheets/d/1SaKg4pTiquk32kw9qauzWWrDsZcNiGSL83G8yULXJIE/edit#gid=852993701)
- [機能／デザイン仕様一覧](https://docs.google.com/spreadsheets/d/1hUg4X2BChH0Uke0HFLX1G4h9MBK__HNb5_TWQ4eL05Y/edit#gid=1396076322)

<br>

### システム仕様

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

#### btool-settings
buddy-themeの設定情報等を格納する

##### buddy-parts-testcases.json
テストケース情報を設定しているファイル

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/16pk-IFDGNxv7gjVvLemW0kNlOwpuLdcpc8zJYL81N6Y/edit#gid=318273719)

単体テスト > make buddy parts testcases json

##### function-design.json

標準機能仕様、ブロック個別機能仕様を一覧で管理する情報

[取得スクリプト](https://script.google.com/a/wmshome.net/d/1yw1TXWMZCW3-n5IJzYfirvsKSqnuWVVPKZuNhecPf3nQkS6VsKdl8k8k/edit?usp=drive_web)

##### parts-categories.json

部品とCSSブロックのマッピング情報

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/1kkHsXTtCFVtYcj0ZwbPDukPQkPrzJGrIrVOWGBUqeIg/edit#gid=0)

単体テスト > make parts categories json

#### schemas
dataJson, metaJsonのスキーマ情報

#### utils

##### buddy-parts-functions.json

機能初期値、テスト値とブロックの対応状況の定義情報

[生成用スプレッドシート](https://docs.google.com/spreadsheets/d/1kkHsXTtCFVtYcj0ZwbPDukPQkPrzJGrIrVOWGBUqeIg/edit#gid=0)

単体テスト > make buddy parts functions json


##### buddy-parts-design.json

デザイン仕様を確認するための機能とマッピング

手動で作成

##### ブロック専用jsonファイル

ブロック固有の事情で必要になるファイル
手動で作成

- breadcrumbs001.json
- formTableAll.json
- sideMenu001.json
