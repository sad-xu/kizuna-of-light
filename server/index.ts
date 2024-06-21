import express from 'express';
import path from 'path';
import c from 'child_process';
import baseApi from './routes/base';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const isDev = process.env.NODE_ENV == 'development';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../../dist')));

app.use('/api/base', baseApi);

// 错误处理  一般业务错误
app.use((err, req, res, next) => {
  res.json({ code: -500, msg: err.message });
});

// 404
app.use((req, res, next) => {
  res.status(404).send('🐸 404 Not Found! 🐸');
});

const server = app.listen(8653, () => {
  const port = (server.address() as any).port || '';
  if (!isDev) {
    c.exec(`start http://localhost:${port}/`);
  }
  console.log(`🤡 http://localhost:${port}/ 🤡`);
});
