import { AppRedisService } from './services/redis-service';
import { CountQuantityDto } from './dto/countQuantity.dto';
export declare class AppService {
    private readonly redisService;
    constructor(redisService: AppRedisService);
    getHello(): string;
    doSyncDocumentItem(sapDocNum: string, payload: any): Promise<{}>;
    takePI(sapDocNum: string): Promise<{
        result: string;
    }>;
    getItemsFromDB(sapDocNum: string): Promise<{
        result: any;
    }>;
    updateItemFromDB(countQuantityDto: CountQuantityDto): Promise<{
        result: any;
    }>;
    syncDataRedisToDB(sapDocNum: string): Promise<void>;
}
