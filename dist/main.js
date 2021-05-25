"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cors = require('cors');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    await app.listen(3000);
}
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const haftCpu = Math.floor(numCPUs / 2);
const _max = haftCpu;
if (cluster.isMaster) {
    for (let i = 0; i < 6; i++) {
        cluster.fork();
        console.log('cluster fork');
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
}
else {
    bootstrap();
}
//# sourceMappingURL=main.js.map