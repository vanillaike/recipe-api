const Koa = require('koa');
const koaBody = require('koa-body');
const mongo = require('koa-mongo');

require('dotenv').config();

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
