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


// エラー通知 & watch中にエラーが出ても処理を止めないように

function plumberWithNotify() {
  return plumber({errorHandler: notify.onError("<%= error.message %>")});
}

// clean

gulp.task('clean', function() {
  del(['production', 'devStuff/css/**/*.css']);
});


// sass compile
const sassOptions = minimist(process.argv.slice(2));
switch (sassOptions) {
  default:
    var styleSource = ['devStuff/src/**/pc-L25.s[ac]ss','devStuff/src/**/sp.s[ac]ss'];
  case 'pc':
    var styleSource = 'devStuff/src/**/pc-L25.s[ac]ss';
  case 'sp':
    var styleSource = 'devStuff/src/**/sp.s[ac]ss';
  case 'all':
    var styleSource = 'devStuff/src/**/*.s[ac]ss';
  case 'build':
    var styleSource = 'devStuff/src/**/*.s[ac]ss';
}

gulp.task('sass', function() {
  return gulp.src(styleSource)
  // buildの場合はsourcemapsを実行しない
  .pipe(gulpIf(!sassOptions.build, sourcemaps.init()))
  .pipe(plumberWithNotify())
  // sourcemapsの表示行数がずれるので開発時はminifyしない
  .pipe(gulpIf(sassOptions.build, sass({outputStyle: 'compressed'}), sass()))
  .pipe(gulpIf(sassOptions.build, autoprefixer({browsers: ['last 3 version', 'ie >= 11', 'Android 4.0']}))) // buildオプションが付いた場合はautoprefixerを有効にする
  .pipe(gulpIf(!sassOptions.build, sourcemaps.write()))
  .pipe(gulp.dest('devStuff/css'));
});


// sass lint

gulp.task('sasslint', function() {
  return gulp.src(['devStuff/src/**/*.s[ac]ss'])
  .pipe(sassLint({
    files: {
      ignore: 'devStuff/src/config/*.s[ac]ss'
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

gulp.task('aigis', function(){
  return gulp.src('devStuff/aigis_config.yml')
  .pipe(aigis());
});

// copy css file to styleguide

gulp.task('copy-css', function(){
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

gulp.task('create_build',function(){
  var theme = get_theme_name();
  var values = get_deploy_values();

  output_imgs(theme);
  output_css(theme, values);
})

function get_theme_name() {
  var currentPath = __dirname.split('/');
  var theme = currentPath[currentPath.length - 1];
  return theme;
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
    .pipe(gulp.dest('production/theme_materials/' + aTheme + '/imgs/'));
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
    .pipe(gulp.dest('production/themes/' + folder + '/pc/'));
}
function output_rename_sp_css(value, folder) {
  gulp.src('devStuff/css/sp' + value.variation + '.css')
    .pipe(rename('theme.css'))
    .pipe(gulp.dest('production/themes/' + folder + '/sp/'));
}

// gulp tasks sassdoc
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




// gulp tasks

gulp.task('default', ['watch']);
gulp.task('run-compact', ['watch-compact']);
gulp.task('build', function(){
  return runSequence(
    'clean',
    'sass',
    'create_build'
  );
});

gulp.task('developing', function() {
  return runSequence(
    'sass',
    'aigis'
  );
});

gulp.task('developing-compact', function() {
  return runSequence(
    'sass',
    'copy-css'
  );
});

gulp.task('watch', ['sass','aigis','sassdoc','server'], function() {
  gulp.watch(['devStuff/src/**/*','spec_description/**/*'],['developing',browserSync.reload]);
});

gulp.task('watch-compact', ['sass','aigis','sassdoc','server'], function() {
  gulp.watch(['devStuff/src/**/*','spec_description/**/*'],['developing-compact',browserSync.reload]);
});