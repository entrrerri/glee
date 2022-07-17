const { src, dest, watch, parallel } = require("gulp");

const sass = require("gulp-sass")(require("sass")),
  concat = require("gulp-concat"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  // imagemin = require('gulp-imagemin'),

  browserSync = require("browser-sync").create();

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
  });
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        grid: true,
      })
    )
    .pipe(concat("style.min.css"))

    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/slick-carousel/slick/slick.js",
    "app/js/main.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

// function images(){
//     return src('app/images/**/*.*')
//     .pipe(imagemin())
//     .pipe(dest('dist/images'))
//     .pipe(imagemin([
//             imagemin.gifsicle({interlaced: true}),
//             imagemin.mozjpeg({quality: 75, progressive: true}),
//             imagemin.optipng({optimizationLevel: 5}),
//             imagemin.svgo({
//                 plugins: [
//                     {removeViewBox: true},
//                     {cleanupIDs: false}
//                 ]
//             })
//         ]
//     ))

// }

function build() {
  return src(["app/**/*.html", "app/css/style.min.css", "app/js/main.min.js"], {
    base: "app",
  }).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  // ! исключение файла из отслеживания
  watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
// exports.images = images;
exports.watching = watching;
exports.build = build;

exports.default = parallel(styles, scripts, browsersync, watching);
// нужно чтобы все таски запускались одной командой в строке (gulp)
