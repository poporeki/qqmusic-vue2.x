const Koa = require('koa');
const app = new Koa();
const path = require('path');
const static = require('koa-static');
const {
  historyApiFallback
} = require('koa2-connect-history-api-fallback');

const PORT = 9003;

app.use(historyApiFallback({
  history: './dist/index.html'
}));
app.use(static(
  path.join(__dirname, "./dist")
))

app.listen(PORT, () => console.log(`QQMUSIC-VUE2.X SERVER'S RUNNING.  PORT:${PORT}`));