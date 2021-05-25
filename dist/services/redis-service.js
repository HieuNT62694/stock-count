"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRedisService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const date_fns_1 = require("date-fns");
let AppRedisService = class AppRedisService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async initStockItem(sapDocNum, itemId, rawPayload) {
        console.log({ sapDocNum, itemId });
        this.redisService.getClient('cache').hmset(`stock_count_items_key_${sapDocNum}`, { [itemId]: itemId });
        return this.redisService.getClient('cache').hmset(`stock_count_items_${sapDocNum}:${itemId}`, rawPayload);
    }
    async updateQuantityItem(countQuantityDto) {
        this.markHasItemChange(countQuantityDto);
        return this.redisService.getClient('cache').hmset(`stock_count_items_${countQuantityDto.sapDocNum}:${countQuantityDto.itemId}`, {
            quantity: countQuantityDto.quantity,
        });
    }
    async getItemsByDocnum(sapDocNum) {
        const client = this.redisService.getClient('cache');
        console.log({ sapDocNum });
        const objects = await client.hgetall(`stock_count_items_key_${sapDocNum}`);
        return Promise.all(Object.keys(objects).map(async (itemId) => {
            return await client.hgetall(`stock_count_items_${sapDocNum}:${itemId}`);
        }));
    }
    async markHasItemChange(countQuantityDto) {
        const nowAt = date_fns_1.format(new Date(), 'yyyyMMddHHiiss');
        return this.redisService.getClient('cache').set(`stock_count_item_has_change:${countQuantityDto.sapDocNum}:${countQuantityDto.itemId}`, JSON.stringify({
            'quantity': countQuantityDto.quantity,
            'nowAt': nowAt,
        }));
    }
};
AppRedisService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], AppRedisService);
exports.AppRedisService = AppRedisService;
//# sourceMappingURL=redis-service.js.map