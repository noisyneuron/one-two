var gulp = require('gulp'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  print = require('gulp-print'),
  imagemin = require('gulp-imagemin'),
  browserify = require('gulp-browserify'),
  argv = require('yargs').argv,
  gulpif = require('gulp-if'),
  uncss = require('gulp-uncss'),
  git = require('gulp-git'),
  clean = require('gulp-clean');

var reload = browserSync.reload;

var paths = {
  styles: {
    source: './src/styles/main.scss',
    build: './build/css/',
    dist: './dist/css/'
  },
  scripts: {
    source: './src/scripts/main.js',
    build: './build/js/',
    dist: './dist/js/',
    shim: './src/scripts/vendor/html5shiv.min.js',
    vendor_source: './src/scripts/vendor/vendor.js'
  },
  images: {
    source: './src/images/',
    build: './build/images/',
    dist: './dist/images/'
  },
  templates: {
    source: './src/*.jade',
    build: './build/',
    dist: './dist/'
  }
};

var vendor_dir = "./src/scripts/vendor/";

var browserify_shim = {
  jquery: {
    path: String(vendor_dir + "jquery-2.1.1.min.js"),
    exports: '$'
  },
  lodash: {
    path: String(vendor_dir + "lodash-2.4.1.min.js"),
    exports: '_'
  },
  statemachine: {
    path: String(vendor_dir + "state-machine.js"),
    exports: 'StateMachine'
  },
};


/* ==================== TASKS FOR DEV MODE ==================*/
gulp.task('browser-sync', ['templates', 'images', 'styles', 'scripts', 'vendor-scripts', 'html5shiv'], function () {
  browserSync({
    server: {
      baseDir: "./build"
    },
    open: false
  });
});


gulp.task('templates', function () {
  return gulp.src(paths.templates.source)
    .pipe(jade({pretty : true}))
    .pipe(gulp.dest(paths.templates.build))
    .pipe(reload({stream: true}));
});

//TODO: make gulp report css errors
gulp.task('styles', function () {
  return gulp.src(paths.styles.source)
    .pipe(sass({sourceComments: 'map'}))
    .pipe(gulp.dest(paths.styles.build))
    .pipe(reload({stream: true}));
});


gulp.task('scripts', function () {
  return gulp.src(paths.scripts.source)
    .pipe(browserify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(reload({stream: true}));
});


gulp.task('vendor-scripts', function () {
  return gulp.src(paths.scripts.vendor_source)
    .pipe(browserify({shim: browserify_shim, debug: true}))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(reload({stream: true}));
});


gulp.task('html5shiv', function () {
  return gulp.src(paths.scripts.shim)
    .pipe(gulp.dest(paths.scripts.build));
});

gulp.task('images', function () {
  gulp.src(String(paths.images.build + "*"), {read: false})
    .pipe(clean());
  return gulp.src(String(paths.images.source + "**/*"))
    .pipe(gulp.dest(paths.images.build));
});


gulp.task('default', ['templates', 'images', 'styles', 'scripts', 'vendor-scripts', 'html5shiv', 'browser-sync'], function () {
  gulp.watch("src/**/*.jade", ['templates']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/*.js", ['scripts']);
  gulp.watch("src/scripts/vendor/*.js", ['vendor-scripts']);
  gulp.watch("src/images/**/*", ['images']);
});
/* ================== END TASKS FOR DEV MODE ================*/




/* ==================== TASKS FOR STAGING MODE ==================*/

gulp.task('dist-clean', function () {
  return gulp.src(String(paths.templates.dist + "*"), {read: false})
    .pipe(clean());
});

gulp.task('dist-html5shiv', ['dist-clean'], function () {
  return gulp.src(paths.scripts.shim)
    .pipe(gulp.dest(paths.scripts.dist));
});


gulp.task('dist-templates', ['dist-clean'], function () {
  return gulp.src(paths.templates.source)
    .pipe(jade({pretty : true}))
    .pipe(gulp.dest(paths.templates.dist));
});


gulp.task('dist-styles', ['dist-clean', 'dist-vendor-scripts', 'dist-scripts'], function () {
  // NOTE: uncss does weird things with keyframes. not sure it reads javascript insertions
  // .pipe(uncss({html: [String(paths.templates.dist + 'index.html')]})) 
  // sourcemapping and minimising together is not being easy with current plugins
  // for min+maps, include  {sourceComments: 'map', outputStyle: 'compress'}  in sass opts and remove minifyCSS
  return gulp.src(paths.styles.source)
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dist));
});



// FOR simplicity, letting these be seperate files for now
gulp.task('dist-scripts', ['dist-clean'], function () {
  return gulp.src(paths.scripts.source)
    .pipe(browserify())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dist));
});


gulp.task('dist-vendor-scripts', ['dist-clean'], function () {
  return gulp.src(paths.scripts.vendor_source)
    .pipe(browserify({shim: browserify_shim}))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dist));
});

gulp.task('dist-images', ['dist-clean'], function () {
  return gulp.src(String(paths.images.source + "**/*"))
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('dist', ['dist-clean', 'dist-images', 'dist-templates', 'dist-vendor-scripts', 'dist-scripts', 'dist-styles']);




