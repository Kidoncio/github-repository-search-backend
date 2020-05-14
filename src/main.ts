import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Github Search API')
    .setDescription('API para a busca no GitHub de repositórios por linguagem.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  const corsOptions: CorsOptions = {
    origin: (origin: any, callback: any) => {
      callback(null, true);
    },
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(parseInt(process.env.PORT) || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
