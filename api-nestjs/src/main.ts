import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as legacyApp from '/Users/suporte2/Documents/express-nestjs-adapter-demo//nest-express/src/app.js';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const expressApp = express();

  expressApp.use(legacyApp)
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.listen(3000);
}
bootstrap();
