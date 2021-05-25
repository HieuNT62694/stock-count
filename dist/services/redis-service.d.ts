import { RedisService } from 'nestjs-redis';
import { CountQuantityDto } from '../dto/countQuantity.dto';
export declare class AppRedisService {
    private readonly redisService;
    constructor(redisService: RedisService);
    initStockItem(sapDocNum: string, itemId: string, rawPayload: any): Promise<"OK">;
    updateQuantityItem(countQuantityDto: CountQuantityDto): Promise<"OK">;
    getItemsByDocnum(sapDocNum: string): Promise<Record<string, string>[]>;
    markHasItemChange(countQuantityDto: CountQuantityDto): Promise<"OK">;
}
