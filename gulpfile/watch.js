
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gutil = require('gutil');
const server = require('gulp-develop-server');
const gulpsync = require('gulp-sync')(gulp);
const colors = require('colors');

/**
 *
 * 命令：gulp fe
 * 作用：前端开发者开发时直接运行的命令
 *
 */
gulp.task('fe', gulpsync.sync(['compile', 'server', 'browser']), function() {

  gulp.watch(['./views/**/*.*', './public/**/*.*', './stylesheets/**/*.*',], function(event) {

    gulp.start(['compile'], reloadBrowser);

  });

});

/**
 *
 * 命令：gulp browser
 * 作用：启动浏览器
 *
 */
gulp.task('browser', function() {

  browserSync.init({
    proxy: 'http://localhost:8002',
    port: 8000
  });

});

gulp.task('server', function() {

  server.listen({
    path: './server/server.js'
  });

});

/**
 *
 * 刷新浏览器
 *
 */
function reloadBrowser() {

  setTimeout(browserSync.reload, 0);

}

/**
 * 重新运行nodejs进程
 */
function rerunServer() {

  setTimeout(server.restart, 100);

}

/**
 * 根据路径取得文件类型(后缀名)
 *
 * @param      {String}  path    The path
 * @return     {String}  The file type.
 */
function getFileType(path) {

  return path.substr(path.lastIndexOf('.') + 1);

}
