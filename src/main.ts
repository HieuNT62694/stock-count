import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3000);
}

//bootstrap();


const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//const MAX = 4;
const haftCpu = Math.floor(numCPUs /2);

//const maxCpus = numCPUs > 2 ? numCPUs - 1 : 1;
const _max = haftCpu;
if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < 6; i++) {
    cluster.fork();
    console.log('cluster fork');

  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  bootstrap();
}
