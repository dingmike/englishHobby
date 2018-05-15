
/*
* log4js日志记录
* helper{writeDebug}
*
* */
let helper = {};
exports.helper = helper;

let log4js = require('log4js');
let fs = require("fs");
let path = require("path");
let mkdirp = require('mkdirp');

// 加载配置文件
let objConfig = JSON.parse(fs.readFileSync("log4js.json", "utf8"));

console.log(objConfig);

// 目录创建完毕，才加载配置，不然会出异常
log4js.configure(objConfig);
let logDebug = log4js.getLogger('logDebug');
let logInfo = log4js.getLogger('logInfo');
let logWarn = log4js.getLogger('logWarn');
let logErr = log4js.getLogger('logErr');
// let logRedis = log4js.getLogger('logRedis');

helper.writeDebug = function(msg){
    if(msg == null)
        msg = "";
    logDebug.debug(msg);
};

helper.writeInfo = function(msg){
    if(msg == null)
        msg = "";
    logInfo.info(msg);
};

helper.writeWarn = function(msg){
    if(msg == null)
        msg = "";
    logWarn.warn(msg);
};

helper.writeErr = function(msg, exp){
    if(msg == null)
        msg = "";
    if(exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};
helper.writeRedis = function(msg){
    if(msg == null)
        msg = "";
    logRedis.log(msg);
};

// 配合express用的方法
exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
   app.use(log4js.connectLogger(logInfo, {level:'info', format:':method :url'}));
}

// 判断日志目录是否存在，不存在时创建日志目录
function checkAndCreateDir(dir){
    if(!fs.existsSync(dir)){
        mkdirp.sync(dir);
    }
}

// 指定的字符串是否绝对路径
function isAbsoluteDir(path){
    if(path == null)
        return false;
    let len = path.length;

    let isWindows = process.platform === 'win32';
    if(isWindows){
        if(len <= 1)
            return false;
        return path[1] == ":";
    }else{
        if(len <= 0)
            return false;
        return path[0] == "/";
    }
}