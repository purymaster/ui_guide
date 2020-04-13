/*

npm install gulp --save-dev
npm install gulp -g
npm install gulp-cli -g

npm install del --save-dev
npm install gulp-file-include --save-dev
npm install gulp-wait --save-dev
npm install gulp-pretty-html --save-dev
npm install gulp-remove-empty-lines --save-dev
npm install browser-sync --save-dev
npm install gulp-autoprefixer --save-dev
npm install gulp-beautify --save-dev
npm install gulp-imagemin --save-dev

*/

const gulp = require('gulp')
	, del = require('del')
	, include = require('gulp-file-include')
	, pretty = require('gulp-pretty-html')
	, removeline = require('gulp-remove-empty-lines')
	, sync = require('browser-sync').create()
	, prefix = require('gulp-autoprefixer')
	, beautify = require('gulp-beautify')
	, imagemin = require('gulp-imagemin')
	, config = require('./config.js');

// Error
function handleError(err) {
	console.log(`
********** ERROR **********

${err.message}

********** ERROR **********
	`);
	this.emit('end');
};

// Clean
function cleanFile(done) {
	del(config.devAll);
	done();
};

// HTML
function htmlBuild(done) {
	return gulp
		.src(config.srcPath.html)
		.pipe(include({
			prefix: '@@',
			basepath: config.srcPath.include
		}).on('error', handleError))
		.pipe(pretty({
			indent_with_tabs: true,
			unformatted: []
		}))
		.pipe(removeline())
		.pipe(gulp.dest(config.devPath.html))
		.pipe(
			sync.reload({
				stream: true
			})
		);
	done();
};

// CSS
function cssBuild(done) {
	return gulp
		.src(config.srcPath.css, { since: gulp.lastRun(cssBuild) })
		.pipe(prefix({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		}).on('error', handleError))
		.pipe(gulp.dest(config.devPath.css))
		.pipe(
			sync.reload({
				stream: true
			})
		);
	done();
};

// JS
function jsBuild(done) {
	return gulp
		.src(config.srcPath.js, { since: gulp.lastRun(jsBuild) })
		.pipe(beautify())
		.pipe(gulp.dest(config.devPath.js))
		.pipe(
			sync.reload({
				stream: true
			})
		);
	done();
};

// Fonts
function fontBuild(done) {
	return gulp
		.src(config.srcPath.font, { since: gulp.lastRun(fontBuild) })
		.pipe(gulp.dest(config.devPath.font))
		.pipe(
			sync.reload({
				stream: true
			})
		);
	done();
};

// Image
function imageBuild(done) {
	return gulp
		.src(config.srcPath.img, { since: gulp.lastRun(imageBuild) })
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			optimizationLevel: 7,
			svgoPlugins: [{ removeViewBox: false }],
			verbose: true,
			use: []
		}))
		.pipe(gulp.dest(config.devPath.img))
		.pipe(
			sync.reload({
				stream: true
			})
		);
	done();
};

// Watch
function watchFile(done) {
	gulp.watch(config.srcPath.html, gulp.series(htmlBuild, gulp.parallel(reload)));
	gulp.watch(config.srcPath.include, gulp.series(htmlBuild, gulp.parallel(reload)));
	gulp.watch(config.srcPath.css, gulp.series(cssBuild, gulp.parallel(reload)));
	gulp.watch(config.srcPath.js, gulp.series(jsBuild, gulp.parallel(reload)));
	gulp.watch(config.srcPath.font, gulp.series(fontBuild, gulp.parallel(reload)));
	gulp.watch(config.srcPath.img, gulp.series(imageBuild, gulp.parallel(reload)));
	done();
};

// BrowserSync
function browserSync(done) {
	sync.init({
		port: 8080,
		server: {
			baseDir: './',
			index: 'codingmap.html'
		},
		browser: ['google chrome', 'chrome']
		// browser: ['google chrome', 'chrome', 'firefox', 'iexplore', 'opera', 'safari']
	});
	done();
};

// Reload
function reload(done) {
	sync.reload();
	done();
};

gulp.task('default', gulp.series(cleanFile, gulp.parallel(htmlBuild, cssBuild, jsBuild, fontBuild, imageBuild), browserSync, watchFile));