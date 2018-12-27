const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');
const ghPages = require('gulp-gh-pages');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

// optimize images
gulp.task('minify-images', () =>
    gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('src/images'))
);

//minify JS in a single
var jsFiles = 'src/js/*.js',
    jsDest = 'src/js/jsOneFile';

gulp.task('minify-js', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

// compile custom SCSS files
gulp.task('sass', () => {
  return gulp.src([
    'src/scss/*.scss'
  ])
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.stream());
});

gulp.task('minify-css', () => {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('src/css'));
});

// pug build pages
gulp.task('pug', function() {
  return gulp.src('src/templates/*.pug')
  .pipe(pug({
    pretty: false,
    cache: false
  }))
  .pipe(gulp.dest('src'))
  .pipe(browserSync.stream());
});

// copy JS modules
gulp.task('copy-js', () => {
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js'
  ])
  .pipe(gulp.dest('src/js'))
  .pipe(browserSync.stream());
});

// init develop Server
gulp.task('serve', ['sass','pug'], () => {
  browserSync.init({
    server: './src'
  });

  gulp.watch(['src/templates/**/*.pug','src/templates/**/*.txt'], ['pug']);
  gulp.watch(['src/scss/*.scss'], ['sass','minify-css']);
  //gulp.watch(['src/images/**/*'], ['minify-images']);
  gulp.watch(['src/js/*'], ['minify-js']);
  gulp.watch('src/**/*').on('change',
    browserSync.reload
  );
});

gulp.task('build', ['pug', 'sass', 'minify-js', 'minify-images', 'minify-css'])

//Publish gh-pages
gulp.task('deploy', () => {
  return gulp.src('./src/**/*')
    .pipe(ghPages());
});

// defaul task typing 'gulp'
gulp.task('default', ['sass', 'minify-js', 'minify-images', 'minify-css', 'serve'])
