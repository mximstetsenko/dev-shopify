const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const esbuild = require('gulp-esbuild');

const paths = {
  styles: {
    entry: 'src/scss/theme.scss',
    watch: 'src/scss/**/*.scss',
    out: 'assets'
  },
  scripts: {
    entry: 'src/js/index.js',
    watch: 'src/js/**/*.js',
    out: 'assets'
  }
};

function stylesDev() {
  return src(paths.styles.entry)
    .pipe(sass({ includePaths: ['src/scss'] }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.styles.out));
}

function stylesBuild() {
  return src(paths.styles.entry)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(paths.styles.out));
}

function scriptsDev() {
  return src(paths.scripts.entry)
    .pipe(
      esbuild({
        bundle: true,
        sourcemap: true,
        outfile: 'theme.js',
        target: 'es2019',
        format: 'iife'
      })
    )
    .pipe(dest(paths.scripts.out));
}

function scriptsBuild() {
  return src(paths.scripts.entry)
    .pipe(
      esbuild({
        bundle: true,
        minify: true,
        sourcemap: false,
        outfile: 'theme.js',
        target: 'es2019',
        format: 'iife'
      })
    )
    .pipe(dest(paths.scripts.out));
}

function watcher() {
  watch(paths.styles.watch, stylesDev);
  watch(paths.scripts.watch, scriptsDev);
}

exports.default = series(parallel(stylesDev, scriptsDev), watcher);
exports.build = parallel(stylesBuild, scriptsBuild);


