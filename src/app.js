const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
require('dotenv').config();

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running.`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died.`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} is now running.`);

    const api = require('./api');
    api.start();
}
