import { Module } from '@nestjs/common';

import { LoadtestController } from './loadtest.controller';
import { AwsSdkModule } from 'nest-aws-sdk';

@Module({
  imports: [
    // RedisModule.register([
    //     {
    //       name: 'cache',
    //       url: 'redis://127.0.0.1:6379/2',
    //       onClientReady: (client): any => {
    //         client.on('error', (err) => {
    //             console.log(err);
    //           },
    //         );
    //       },
    //     },
    //   ],
    // ),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '127.0.0.1',
    //   port: 3306,
    //   username: 'root',
    //   password: 'Aesx5099',
    //   database: 'test',
    //   autoLoadEntities: true,
    //   synchronize: false,
    //   maxQueryExecutionTime: 30000,
    //   logging: ["query"],
    //   logger: "advanced-console",

    // }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: 'ap-southeast-1',
        // credentials: new SharedIniFileCredentials({
        //   profile: 'my-profile',
        // }),
        credentials: {
          accessKeyId: "string",
          secretAccessKey: "string"
        }
      },
      // services: [],
    }),
  ],
  controllers: [ LoadtestController],
  //providers: [AppService, AppRedisService],
})
export class AppModule {
}
