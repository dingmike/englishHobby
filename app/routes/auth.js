//未使用

const router = require('express').Router();
const getJsApiData = require('../libs/getJsApiData');
const config = require('../../config');

router.get('/auth', function (req, res) {
  let clientUrl = 'http://' + req.hostname + req.url;
  getJsApiData(clientUrl).then(data => {

   // console.log( 'auth信息' + {signature: data[0], timestamp: data[1], nonceStr: data[2], appId: config.appId})
   res.render('base.html', {signature: data[0], timestamp: data[1], nonceStr: data[2], appId: config.appId});
  });
});

module.exports = router;