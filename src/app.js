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

    const Koa = require('koa');
    const koaBody = require('koa-body');
    const mongo = require('koa-mongo');

    const app = new Koa();

    app.use(mongo({
        uri: process.env.MONGO_URI,
        max: 100,
        min: 1
    }));
    app.use(koaBody());

    let recipeRoutes = require('./recipes');
    app.use(recipeRoutes.routes());

    const port = process.env.PORT || 5000
    app.listen(port);
}
