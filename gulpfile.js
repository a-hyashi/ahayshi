const gulp = require('gulp');
const aigis = require('gulp-aigis');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const sassLint = require('gulp-sass-lint');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const minimist = require('minimist');
const del = require('del');
const fs = require('fs');
const sassdoc = require('sassdoc');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const merge = require('event-stream').merge;
const make_html = require('./lib/make_html');
const make_datajson = require('./lib/make_datajson');
const make_allDatajson = require('./lib/make_all-datajsons');
const make_aigis = require('./lib/make_aigis');
const config = require('./gulp_config.json');

// エラー通知 & watch中にエラーが出ても処理を止めないように

function plumberWithNotify() {
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
}

// sass compile
let sassBuildType = process.argv.slice(2)[1];
let sassOptions = {};
var styleSource;
switch (sassBuildType) {
  case '--pc':
    styleSource = ['devStuff/src/**/pc-L25.s[ac]ss'];
    sassOptions.build = false;
    break;
  case '--sp':
    styleSource = ['devStuff/src/**/sp.s[ac]ss'];
    sassOptions.build = false;
    break;
  case '--all':
    styleSource = ['devStuff/src/**/*.s[ac]ss'];
    sassOptions.build = false;
    break;
  case '--build':
    styleSource = ['devStuff/src/**/*.s[ac]ss'];
    sassOptions.build = true;
    break;
  default:
    styleSource = ['devStuff/src/**/pc-L25.s[ac]ss','devStuff/src/**/pc-N00.s[ac]ss','devStuff/src/**/sp.s[ac]ss'];
    sassOptions.build = false;
    break;
}

gulp.task('sass', function() {
  return merge(
    styleSource.map(styleSource=>{
      return gulp.src(styleSource)
        // buildの場合はsourcemapsを実行しない
        .pipe(gulpIf(!sassOptions.build, sourcemaps.init()))
        .pipe(plumberWithNotify())
        // sourcemapsの表示行数がずれるので開発時はminifyしない
        .pipe(gulpIf(sassOptions.build, sass({outputStyle: 'compressed'}), sass()))
        .pipe(debug())
        .pipe(gulpIf(sassOptions.build, autoprefixer({browsers: ['last 3 version', 'ie >= 11', 'Android 4.0']}))) // buildオプションが付いた場合はautoprefixerを有効にする
        .pipe(gulpIf(!sassOptions.build, sourcemaps.write()))
        .pipe(gulp.dest('devStuff/css'));
    })
  );
});


// sass lint

gulp.task('sasslint', function() {
  return gulp.src(['devStuff/src/**/*.s[ac]ss'])
  .pipe(sassLint({
    files: {
      ignore: 'devStuff/src/assets/*.s[ac]ss'
    },
    rules: {
      'property-sort-order': 0,
      'no-css-comments': 0,
      'no-color-keywords': 0,
      'no-color-literals': 0,
      'variable-name-format': 0,
      'no-empty-rulesets': 0,
      'class-name-format': 0,
      'mixin-name-format': 0,
      'empty-line-between-blocks': 0, //本来はチェックしたいが、017でこれを全て修正するのは難しい
      'quotes': 0, //本来はチェックしたいが、017でこれを全て修正するのは難しい
      'nesting-depth': 0 //本来はチェックしたいが、017でこれを全て修正するのは難しい
    }
  }))
  .pipe(sassLint.format())
  .pipe(sassLint.failOnError());
});


// styleguide

gulp.task('aigis', function() {
  return gulp.src('devStuff/aigis_config.yml')
  .pipe(aigis());
});

// copy css file to styleguide

gulp.task('copy-css', function() {
  return gulp.src('devStuff/css/*.css')
  .pipe(gulp.dest('devStuff/styleguide/css'));
});

// webserver

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './devStuff/styleguide',
      routes: {
        "/sassdoc": "./devStuff/sassdoc"
      }
    }
  });
});


// build tasks

gulp.task('create_build',function() {
  var theme = get_theme_name();
  var values = get_deploy_values();

  output_imgs(theme);
  output_css(theme, values);
})

function get_theme_name() {
  return __dirname.split('/').pop();
}

function get_deploy_values() {
  var filelist = fs.readdirSync('devStuff/css/');
  var deployValues = [];
  for (var file of filelist) {
    var values = file.split('-');
    if(values.length == 1 || values[0].substring(0, 2) != 'pc') continue;
    deployValues.push(create_deploy_hush(values));
  }
  return deployValues;
}

function create_deploy_hush(aVlues) {
  var variation = aVlues[0].substring(2, 3);
  var ratio = aVlues[1].split('.')[0];
  return ({
    'variation': variation,
    'ratio': ratio
  });
}

function output_imgs(aTheme) {
  gulp.src('devStuff/src/imgs/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(size())
    .pipe(imagemin())
    .pipe(size())
    .pipe(gulp.dest('../../ACRE-theme/acre/theme_materials/' + aTheme + '/imgs/'));
}

function output_css(aTheme, aValues) {
  for(var value of aValues) {
    var folder = aTheme + '-' + value.ratio;
    if(value.variation){
      folder += '-' + value.variation;
    }

    output_rename_pc_css(value, folder);
    output_rename_sp_css(value, folder);
  }
}

function output_rename_pc_css(value, folder) {
  gulp.src('devStuff/css/pc' + value.variation + '-' + value.ratio + '.css')
    .pipe(rename('theme.css'))
    .pipe(gulp.dest('../../ACRE-theme/acre/themes/' + folder + '/pc/'));
}

function output_rename_sp_css(value, folder) {
  gulp.src('devStuff/css/sp' + value.variation + '.css')
    .pipe(rename('theme.css'))
    .pipe(gulp.dest('../../ACRE-theme/acre/themes/' + folder + '/sp/'));
}

gulp.task('sassdoc', function(){
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

// gulp create_b_placer_doc

gulp.task('create_b_placer_doc', function() {
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
  output_b_placer_doc(b_placers);
});

function b_placer_lines() {
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

function to_td_line(arr) {
  return '|' + arr.join('|') + '|';
}

function create_b_placer(b_placer_base, variation_match) {
  // カテゴリー、エリア、名前は前にコメントで出てきた値を使う
  var b_placer = Object.assign(Object.create(Object.getPrototypeOf(b_placer_base)), b_placer_base);
  b_placer.class_name = variation_match[1].trim();
  if(variation_match[3]) b_placer.variation = variation_match[3].trim();
  if(variation_match[5]) b_placer.pc_n00_value = variation_match[5].trim();
  b_placer.pc_value = variation_match[6].trim();
  return b_placer;
}

function update_sp_value(b_placers, variation_match) {
  // PCで作成したb_placerを探し、そのレコードにSPの値を設定する
  var b_placer = b_placers.find(function(b) {
    variation = variation_match[3] ? variation_match[3].trim() : undefined;
    return b.class_name === variation_match[1].trim() && b.variation === variation;
  });
  b_placer.sp_value = variation_match[6].trim();
}

function output_b_placer_doc(b_placers) {
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
  b_placers.forEach(function(b_placer) {
    table.push(b_placer.to_td_line());
  });
  fs.writeFileSync('devStuff/docs/bPlacer.md', (table.join('\n')));

}

gulp.task('delete_datajson', function() {
  return del(['./styleguide_assets/datajson/']);
});

gulp.task('make-allparts-datajson', ['delete_datajson'], function() {
  return make_allDatajson.makeAllDatajsonFull(
    config.html_templates_dir,
    './styleguide_assets/datajson/'
  );
});

gulp.task('delete_html', function() {
  return del(['./styleguide_assets/html/']);
});

gulp.task('make-html', ['delete_html'], function() {
  return make_html.makeHtml(
    './styleguide_assets/html/',
    './styleguide_assets/datajson/',
    config.html_templates_dir,
    false
  );
});

gulp.task('delete_unittest', function() {
  return del(['./unittest/']);
});

gulp.task('make-aigis', ['delete_unittest'], function() {
  return make_aigis.makeAigis(
    './styleguide_assets/html/',
    './unittest/',
    './devStuff/'
  );
});

gulp.task('update-css', function() {
  return runSequence(
    ['sass', 'create_b_placer_doc'],
    'copy-css'
  );
});

gulp.task('update-parts', function() {
  return runSequence(
    'make-allparts-datajson',
    'make-html',
    'make-aigis',
    'aigis'
  );
});

gulp.task('build', function() {
  return runSequence(
    ['sass', 'create_b_placer_doc'],
    'create_build'
  );
});

gulp.task('default', function() {
  gulp.watch(
    [`${config.html_templates_dir}**/*`],
    function(){ runSequence('update-parts', browserSync.reload) }
  );

  gulp.watch(
    ['devStuff/src/**/*.s[ac]ss'],
    function(){ runSequence('update-css', browserSync.reload) }
  );

  return runSequence(
    'server'
  );
});
