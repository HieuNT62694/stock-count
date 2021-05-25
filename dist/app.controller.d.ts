import { AppService } from './app.service';
import { AppRedisService } from './services/redis-service';
import { TakepiDto } from './dto/takepi.dto';
import { SyncDocItem } from './dto/sync.doc.item';
import { CountQuantityDto } from './dto/countQuantity.dto';
export declare class AppController {
    private readonly appService;
    private readonly redisService;
    constructor(appService: AppService, redisService: AppRedisService);
    getHello(): void;
    syncDocItem(syncDocItem: SyncDocItem, request: any): Promise<{}>;
    fakeStock(): {
        ok: string;
    };
    takePI(takepiDto: TakepiDto): Promise<{
        result: string;
    }>;
    getItemByDocnum(sapDocNum: string): Promise<Record<string, string>[]>;
    updateQuantityItemV1(countQuantityDto: CountQuantityDto): Promise<{
        result: string;
    }>;
    updateQuantityItem(countQuantityDto: CountQuantityDto): Promise<{
        result: string;
    }>;
}
