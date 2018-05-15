// (() => {
  'use strict';
  let cluster = require('cluster');
  let config = require('./config.js');
  let appSeverList = require('./app');
  let log4js = require('log4js');
  let os = require('os'); // 多线程


/**
 * Initialise log4js first, so we don't miss any log messages
 */
// log4js.configure('./log4js.json');

// var log = log4js.getLogger("startup");


// system logs
// let log = log4js.getLogger("appSeverList");
// appSeverList.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


  let runServer = () => {
      appSeverList(process.cwd(), config, (app, apps) => {
        apps.listen(config.SSLPORT,function (err) {
            // log.error("Something went wrong:", err);
            console.log('success serverssl................' + config.SSLPORT);
        }); //  servers监听端口 ssl
        app.listen(config.porthttp,function (err) {
            // log.error("Something went wrong:", err);
            console.log('success server...................' + config.porthttp);
        }) //  server监听端口
      });
  };
  if (config.multicore) {
    // Condition that checks if we are on the master process,
    // before creating child processes.
    if (cluster.isMaster) {
      // Fork all the workers.
      const numCPUs = os.cpus().length;
      console.log('numCPUs',numCPUs);
      //  / (parseInt(process.env.CLUSTER_DIVIDER, 10) || 1);
      console.log('Process Master', process.pid);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      Object.keys(cluster.workers).forEach(id => {
        console.log('Running with process ID: ', cluster.workers[id].process.pid);
      });
      // arguments are worker, code, signal
      cluster.on('exit', worker => {
        const RESTART_DELAY = parseInt(process.env.RESTART_DELAY, 10) || 30000;
        console.log('Process ID: ' + worker.process.pid +
          ' died, creating new worker in ' +
          (RESTART_DELAY / 1000) + ' seconds');
        setTimeout(cluster.fork, RESTART_DELAY);
      });
      let allClustersData = {};
      cluster.on('message', function(someData){
        allClustersData[someData.name] = someData.data;
        console.log('everywell',allClustersData)
      })
    } else {
      runServer()
    }
  } else {
    runServer()
  }

// })();
