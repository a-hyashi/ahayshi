const gulp = require('gulp');
const $ = require("gulp-load-plugins")();
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const minimist = require('minimist');
const del = require('del');
const fs = require('fs-extra');
const sassdoc = require('sassdoc');
const merge = require('event-stream').merge;
const make_html = require('./lib/make_html');
const ssh_config = require('../ssh/ssh_config.json');
const make_datajson = require('./lib/make_datajson');
const make_allDatajson = require('./lib/make_all-datajsons');
const make_aigis = require('./lib/make_aigis');
const config = require('./gulp_config.json');

gulp.task('sass', (callback) => {
  styleSources = [
    'devStuff/src/**/pc-L25.s[ac]ss',
    'devStuff/src/**/pc-N00.s[ac]ss',
    'devStuff/src/**/sp.s[ac]ss'
  ];
  merge(
    styleSources.map(styleSource=>{
      return gulp.src(styleSource)
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .pipe($.debug())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('devStuff/css'))
      .pipe(gulp.dest('devStuff/styleguide/css'))
    })
  );
  callback()
});

gulp.task('sass-build', () => {
  styleSource = ['devStuff/src/**/*.s[ac]ss'];
  return merge(
    styleSource.map(styleSource=>{
      return gulp.src(styleSource)
      .pipe($.sass({outputStyle: 'compressed'}))
      .pipe($.debug())
      .pipe($.autoprefixer({browsers: ['last 3 version', 'ie >= 11', 'Android 4.0']}))
      .pipe(gulp.dest('devStuff/css'));
    })
  );
});

// Stylelintで自動整形と構文チェック .stylelintrc.ymlのルール参照
gulp.task('stylelint', () => {
  return runSequence(
    'stylelint-fix',
    'stylelint-check'
  );
});

// ファイルを自動整形
gulp.task('stylelint-fix', () => {
  return gulp.src('devStuff/src/parts/*.scss')
    .pipe($.stylelint({
      fix: true,
      failAfterError: false
    }))
    .pipe(gulp.dest('devStuff/src/parts'));
});

// fix時にチェックも入れると拾いきれない場合があるので分割している
gulp.task('stylelint-check', () => {
  return gulp.src('devStuff/src/parts/*.scss')
    .pipe($.stylelint({
      failAfterError: false,
      reporters: [{formatter: 'string', console: true}]
    }));
});

// styleguide
gulp.task('aigis', () => {
  if (!fs.existsSync('./devStuff/css')){
    fs.mkdirSync('./devStuff/css');
  }
  return gulp.src('devStuff/aigis_config.yml')
  .pipe($.aigis());
});

// webserver
gulp.task('server', () => {
  return browserSync({
    server: {
      baseDir: './devStuff/styleguide',
      routes: {
        "/sassdoc": "./devStuff/sassdoc"
      },
      proxy: "localhost:3000"
    },
    open: false
  });
});

// build tasks
gulp.task('create-build', () => {
  var theme = get_theme_name();
  var values = get_deploy_values();
  output_imgs(theme);
  output_css(theme, values);
})

const get_theme_name = () => {
  return __dirname.split('/').pop();
}

const get_deploy_values = () => {
  var filelist = fs.readdirSync('devStuff/css/');
  var deployValues = [];
  for (var file of filelist) {
    var values = file.split('-');
    if(values.length == 1 || values[0].substring(0, 2) != 'pc') continue;
    deployValues.push(create_deploy_hush(values));
  }
  return deployValues;
}

const create_deploy_hush = (aVlues) => {
  var variation = aVlues[0].substring(2, 3);
  var ratio = aVlues[1].split('.')[0];
  return ({
    'variation': variation,
    'ratio': ratio
  });
}

const output_imgs = (aTheme) => {
  gulp.src('devStuff/src/imgs/**/*.+(jpg|jpeg|png|gif|svg)')
  .pipe($.size())
  .pipe($.imagemin())
  .pipe($.size())
  .pipe(gulp.dest('build/theme_materials/' + aTheme + '/imgs/'));
}

const output_css = (aTheme, aValues) => {
  for(var value of aValues) {
    var folder = aTheme + '-' + value.ratio;
    if(value.variation){
      folder += '-' + value.variation;
    }
    output_rename_pc_css(value, folder);
    output_rename_sp_css(value, folder);
  }
}

const output_rename_pc_css = (value, folder) => {
  gulp.src('devStuff/css/pc' + value.variation + '-' + value.ratio + '.css')
  .pipe($.rename('theme.css'))
  .pipe(gulp.dest('build/themes/' + folder + '/pc/'));
}

const output_rename_sp_css = (value, folder) => {
  gulp.src('devStuff/css/sp' + value.variation + '.css')
  .pipe($.rename('theme.css'))
  .pipe(gulp.dest('build/themes/' + folder + '/sp/'));
}

gulp.task('update-sassdoc', () => {
  var options = {
    dest: './devStuff/sassdoc',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true,
    },
    groups: {
      'undefined': 'Ungrouped',
      foo: 'Foo group',
      bar: 'Bar group',
    },
    basePath: 'https://github.com/SassDoc/sassdoc',
  };
  return gulp.src('devStuff/src/**/*.scss')
  .pipe(sassdoc(options));
});

// gulp create-b-placer-doc
gulp.task('create-b-placer-doc', () => {

  // 一度出てきた情報を保持しておくために使います
  // （例）一度01.見出しと出てくれば、次のが出てくるまでずっと01.見出し
  var b_placer_base = new BPlacerRecord();
  var b_placers = [];
  var is_sp = false;
  b_placer_lines().forEach(function(line) {

    // $device =='SP' 以降はSPの余白として設定する
    sp_match = line.match(/\$device\s*==\s*\'SP\'/);
    if(sp_match) is_sp = true;

    // //# で始まるコメントはカテゴリー
    var category_match = line.match(/\/\#\s+(.*)/);
    if(category_match) b_placer_base.category = category_match[1].trim();

    // //## で始まるコメントはエリアと名前 | でエリアと名前を区切る
    var area_and_name_match = line.match(/\/\##\s+(.*)/);
    if(area_and_name_match) {
      var area_and_name = area_and_name_match[1].trim().split('|');
      b_placer_base.area = area_and_name[0].trim();
      b_placer_base.name = area_and_name[1].trim();
    }

    // .t0-b-で始まる文字はバリエーション
    // [a-zA-Z]がないと数字がバリエーション名の中に紛れてしまう
    // 正規表現がややこしくなるため、スペース等はあまり考慮していません
    // .t0-b-xxxxx(数字 or #{$...} or 無)-bPlacer{@if $layout == "N00" {padding-bottom:00;}@else{padding-bottom:99;}}
    // [0]: 全体
    // [1]: クラス名
    // [2]: t0-
    // [3]: バリエーション名
    // [4]: {}の中身（使わない）
    // [5]: N00がある場合の余白の値
    // [6]: N00でない余白の値
    var variation_match = line.match(/(\.(t0-)?b-[\.\_\-a-zA-Z0-9]*[a-zA-Z])(\d*|\#\{\$[a-zA-Z0-9]+\})?-bPlacer{(.+N00.+padding-bottom:(.+?);)?.*padding-bottom:(.+?);}/);
    if(variation_match) {
      if(!is_sp) {
        b_placers.push(create_b_placer(b_placer_base, variation_match));
      }else{
        update_sp_value(b_placers, variation_match);
      }
    }
  });
  return output_b_placer_doc(b_placers);
});

const b_placer_lines = () => {
  var b_placer_scss = fs.readFileSync('devStuff/src/config/_bPlacer.scss', 'utf8');
  return b_placer_scss.toString().split('\n');
}

class BPlacerRecord {
  constructor(
    category,
    area,
    name,
    class_name,
    variation,
    pc_value,
    pc_n00_value,
    sp_value
  ) {
    this.category = category;
    this.area = area;
    this.name = name;
    this.class_name = class_name;
    this.variation = variation;
    this.pc_value = pc_value;
    this.pc_n00_value = pc_n00_value;
    this.sp_value = sp_value;
  }
  to_td_line() {
    return to_td_line([
      this.category,
      this.area,
      this.name,
      this.class_name,
      this.variation,
      this.pc_value,
      this.pc_n00_value,
      this.sp_value
    ]);
  }
}

const to_td_line = (arr) => {
  return '|' + arr.join('|') + '|';
}

const create_b_placer = (b_placer_base, variation_match) => {
  // カテゴリー、エリア、名前は前にコメントで出てきた値を使う
  var b_placer = Object.assign(Object.create(Object.getPrototypeOf(b_placer_base)), b_placer_base);
  b_placer.class_name = variation_match[1].trim();
  if(variation_match[3]) b_placer.variation = variation_match[3].trim();
  if(variation_match[5]) b_placer.pc_n00_value = variation_match[5].trim();
  b_placer.pc_value = variation_match[6].trim();
  return b_placer;
}

const update_sp_value = (b_placers, variation_match) => {
  // PCで作成したb_placerを探し、そのレコードにSPの値を設定する
  var b_placer = b_placers.find((b) => {
    variation = variation_match[3] ? variation_match[3].trim() : undefined;
    return b.class_name === variation_match[1].trim() && b.variation === variation;
  });
  b_placer.sp_value = variation_match[6].trim();
}

const output_b_placer_doc = (b_placers) => {
  var th =
    [
      'カテゴリ',
      'エリア',
      '部品名・要素名',
      'クラス名',
      'バリエーション',
      'PC',
      'PC<br>(N00)',
      'SP'
    ];

  var table = [to_td_line(th), to_td_line('-'.repeat(th.length).split(''))];
  b_placers.forEach((b_placer) => {
    table.push(b_placer.to_td_line());
  });
  fs.writeFileSync('devStuff/docs/bPlacer.md', (table.join('\n')));
}

gulp.task('delete-datajson', () => {
  return del(['./styleguide_assets/datajson/']);
});

gulp.task('make-allparts-datajson', ['delete-datajson'], () => {
  return make_allDatajson.makeAllDatajsonFull(
    config.html_templates_dir,
    './styleguide_assets/datajson/'
  );
});

gulp.task('delete-html', () => {
  return del(['./styleguide_assets/html/']);
});

gulp.task('make-html', ['delete-html'], () => {
  return make_html.makeHtml(
    './styleguide_assets/html/',
    './styleguide_assets/datajson/',
    config.html_templates_dir,
    false
  );
});

gulp.task('delete-unittest', () => {
  return del(['./unittest/']);
});

gulp.task('make-aigis', ['delete-unittest'], () => {
  return make_aigis.makeAigis(
    './styleguide_assets/html/',
    './unittest/',
    './devStuff/'
  );
});

gulp.task('update-css', () => {
  return runSequence([
    'sass',
    'create-b-placer-doc'
  ]);
});

gulp.task('update-imgs', () => {
  return gulp.src('./devStuff/src/imgs/**/*', { base: './devStuff/src/imgs/' })
  .pipe($.changed('./devStuff/styleguide/imgs/'))
  .pipe(gulp.dest('./devStuff/styleguide/imgs/'));
});

gulp.task('update-parts', () => {
  return runSequence(
    'make-allparts-datajson',
    'make-html',
    'make-aigis',
    'aigis'
  );
});

gulp.task('build', () => {
  return runSequence(
    ['sass-build', 'create-b-placer-doc'],
    'create-build'
  );
});

gulp.task('output', () => {
  return runSequence(
    'create-build'
  );
});

// sftp upload
// FTPサーバーにテーマフォルダのtheme.cssをアップロードする
// 全部まとめてやると多すぎてエラーになるのでテーマの値違いで分割してある
gulp.task('upload',  () => {
  upload_themes('');
})
// テーマの2番をアップロード
gulp.task('upload-2',  () => {
  upload_themes('-2');
})
// テーマの3番をアップロード
gulp.task('upload-3',  () => {
  upload_themes('-3');
})
// 画像をアップロード
gulp.task('upload-img',  () => {
  upload_img();
})

const upload_themes = (variation) => {
  var theme = get_theme_name();
  for(var ratio of ["L25", "L30", "N00", "R25", "R30"]) {
    for(var device of ["pc", "sp"]) {
      // variationでテーマの2番と3番に対応
      sftp_each_themes(theme + '-' + ratio + variation + '/' + device + '/');
    }
  }
};

// sftpでファイルがアップロードされる
const sftp_each_themes = (folder) => {
  return gulp.src([
    'build/themes/' + folder + '/theme.css'
  ])
  .pipe($.sftp({
    // 内容はssh_config.jsonに記載
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/themes/' + folder + '/')
  }));
}

const upload_img = () => {
  return gulp.src([
    // SFTP error or directory existsのエラーが出るが気にしないこと
    'build/theme_materials/**/*'
  ])
  .pipe($.sftp({
    // 内容はssh_config.jsonに記載
    host: ssh_config.host_name,
    user: ssh_config.user_name,
    key: {
      location: ssh_config.key_location,
      passphrase: ssh_config.password
    },
    remotePath: ('/mnt/efs/master/acre/theme_materials/')
  }));
}

// themesとtheme_materialsをACRE-Themeにコピー
gulp.task('output', () => {
  return gulp.src([
    'build/themes/**/*',
    'build/theme_materials/**/*'
  ], {
    // ディレクトリ構造を維持させる
    base: 'build'
  })
  .pipe(gulp.dest('../../ACRE-theme/acre/'));
});

gulp.task('default', ['update-css', 'update-imgs'], () => {
  // ファイルが多いため部品のwatchはギブアップする
  gulp.watch(
    ['devStuff/src/**/*.s[ac]ss'],
    () => { runSequence('update-css') }
  );
  // sassでの検知だとcssが更新されないため、cssファイルを直接watchする
  // 複数回reloadが実行されるのは直したい
  gulp.watch(
    ['devStuff/styleguide/css/*.css'],
    () => { browserSync.reload() }
  );
  return runSequence(
    'server'
  );
});
