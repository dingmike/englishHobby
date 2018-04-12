/**
 * Created by admin on 2018/3/27. 未使用
 */

/* 调用
var config = {
    wechat:{
        appID:'...',
        appSecret:'...',
        token:'...'
    }
};
  引入：var wechat = require('./wechat/generator');

* 调用 ：wechat(config.wechat)
* 注入： app.use(wechat(config.wechat));
*/
function Wechat(opts){   //构造函数，用以生成实例，完成初始化工作，读写票据
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken().then(function(data){
        try{
            data = JSON.parse(data);
        }catch(e){
            return that.updateAccessToken();
        }
        if(that.isvalidAccessToken(data)){
            Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function(data){
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(JSON.stringify(data));
    });
}
var wechat = new Wechat(opts); // 实例化
module.exports = wechat;