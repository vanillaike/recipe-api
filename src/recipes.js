const Router = require('koa-router');
const router = new Router({prefix: '/api/v1/recipes'});
const mongo = require('koa-mongo');

router.get('/count', async (ctx, next) => {
    const recipes = await collection(ctx).find().toArray()
    ctx.body = { count: recipes.length };
});

router.get('/', async (ctx, next) => {
    const recipes = await collection(ctx).find().toArray();
    ctx.body = recipes;

    next();
});

router.post('/', async (ctx, next) => {
    if (!ctx.request.body.name) {
        ctx.response.status = 400;
        ctx.body = { message: 'Please enter the data' };
    } else {
        const result = await collection(ctx).insertOne(ctx.request.body);
        ctx.response.status = 201;
        ctx.body = { message: `New recipe added with id: ${result.ops[0]._id.toString()}` };
    }

    next();
});

router.get('/:id', async (ctx, next) => {
    const recipe = await collection(ctx).findOne({_id: mongo.ObjectId(ctx.params.id)})

    if (recipe) {
        ctx.body = recipe;
    } else {
        ctx.response.status = 404;
        ctx.body = { message: 'Recipe not found' };
    }

    next();
});

router.put('/:id', async (ctx, next) => {
    await collection(ctx).updateOne({ _id: mongo.ObjectId(ctx.params.id) }, { $set: ctx.request.body });
    ctx.body = {message:`The recipe with id: ${ctx.params.id} has been updated.`};

    next();
});

router.del('/:id', async (ctx, next) => {
    await collection(ctx).deleteOne({
        _id: mongo.ObjectId(ctx.params.id)
    });

    next();
});

function collection(ctx) {
    return ctx.db.collection('recipes');
}

module.exports = router;
