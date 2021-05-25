import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { CountQuantityDto } from '../dto/countQuantity.dto';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Injectable()
export class AppRedisService {
  constructor(private readonly redisService: RedisService) {
  }

  async initStockItem(
    sapDocNum: string,
    itemId: string,
    rawPayload,
  ) {
    console.log({ sapDocNum, itemId });
    this.redisService.getClient('cache').hmset(`stock_count_items_key_${sapDocNum}`, { [itemId]: itemId });
    return this.redisService.getClient('cache').hmset(`stock_count_items_${sapDocNum}:${itemId}`, rawPayload);
  }

  async updateQuantityItem(countQuantityDto: CountQuantityDto) {
    this.markHasItemChange(countQuantityDto);
    return this.redisService.getClient('cache').hmset(`stock_count_items_${countQuantityDto.sapDocNum}:${countQuantityDto.itemId}`, {
          quantity: countQuantityDto.quantity,
    });
  }

  async getItemsByDocnum(
    sapDocNum: string,
  ) {
    // console.log({ storeId, sapDocNum, stockType });
    const client = this.redisService.getClient('cache');
    console.log({ sapDocNum });
    const objects = await client.hgetall(`stock_count_items_key_${sapDocNum}`);
    return Promise.all(Object.keys(objects).map(async itemId => {
      return await client.hgetall(`stock_count_items_${sapDocNum}:${itemId}`);
    }));
  }

  async markHasItemChange(countQuantityDto: CountQuantityDto) {
    const nowAt = format(new Date(), 'yyyyMMddHHiiss');
    return this.redisService.getClient('cache').set(`stock_count_item_has_change:${countQuantityDto.sapDocNum}:${countQuantityDto.itemId}`, JSON.stringify(
      {
        'quantity': countQuantityDto.quantity,
        'nowAt': nowAt,
      },
    ));
  }
}
