const gulp = require('gulp');
const $ = require("gulp-load-plugins")();

gulp.task('stylelint-check', () => {
  return gulp.src('devStuff/src/parts/*.scss')
    .pipe($.stylelint({
      reporters: [{formatter: 'string', console: true}]
    }));
});
