const gulp = require('gulp');
const ts = require('gulp-typescript');
const maps = require('gulp-sourcemaps');

const BUILD_DIR = "bin";
const PROD_DIR = "dist";

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build_dev', () => {
    return tsProject.src()
        .pipe(maps.init())
        .pipe(tsProject()).js
        .pipe(maps.write())
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('watch', ['build_dev'], () => {
    gulp.watch('src/**/*.ts', ['build_dev']);
});

gulp.task('build_prod', () => {
    const tsResult = tsProject.src().pipe(tsProject());
    tsResult.js.pipe(gulp.dest(PROD_DIR+"/"+BUILD_DIR));
    gulp.src('package.json').pipe(gulp.dest(PROD_DIR));
    gulp.src('config.json').pipe(gulp.dest(PROD_DIR));
    gulp.src('errors.json').pipe(gulp.dest(PROD_DIR));
});

gulp.task('default', ['watch']);