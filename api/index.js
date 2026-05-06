// api/index.js – Vercel serverless wrapper for NestJS
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../backend/dist/src/app.module');
const serverless = require('serverless-http');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { ValidationPipe } = require('@nestjs/common');

let cachedHandler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply same middlewares as in src/main.ts
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());
  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true });
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.init();
  return serverless(app.getHttpAdapter().getInstance());
}

module.exports = async (req, res) => {
  if (!cachedHandler) cachedHandler = await bootstrap();
  return cachedHandler(req, res);
};
