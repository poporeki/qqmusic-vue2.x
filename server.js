const Koa = require('koa');
const app = new Koa();
const path = require('path');
const static = require('koa-static');
const {
  historyApiFallback
} = require('koa2-connect-history-api-fallback');

app.use(historyApiFallback({
  history: './dist/index.html'
}));
app.use(static(
  path.join(__dirname, "./dist")
))

app.listen(3002, () => console.log('blog\'s backstage is running'));