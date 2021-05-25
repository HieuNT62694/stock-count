import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AppRedisService } from './services/redis-service';
import { TakepiDto } from './dto/takepi.dto';
import { SyncDocItem } from './dto/sync.doc.item';
import { CountQuantityDto } from './dto/countQuantity.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: AppRedisService) {
  }

  @Get()
  getHello() {
    // return this.redisService.initStockItem('1134', '00112233', '4', '123', {});
  }

  @Post('/sync-doc-item')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syncDocItem(@Body() syncDocItem: SyncDocItem, @Request() request) {
    return this.appService.doSyncDocumentItem(syncDocItem.sapDocNum, []);
  }

  @Get('/fake-stock')
  fakeStock() {
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 1000; j++) {
        // this.redisService.initStockItem(`${i}`, `00112233${i}`, '4', `${j}`, {});

      }
    }

    return { 'ok': '1' };
  }

  @Post('/take-pi')
  async takePI(@Body() takepiDto: TakepiDto) {
    return this.appService.takePI(takepiDto.sapDocNum);
  }

  @Get('/items/:sapDocNum')
  async getItemByDocnum(@Param('sapDocNum') sapDocNum: string) {
    const data = await this.redisService.getItemsByDocnum(sapDocNum);
    return data;
  }

  @Post('/update-quantity-v1')
  async updateQuantityItemV1(@Body() countQuantityDto: CountQuantityDto) {
    await this.appService.updateItemFromDB(countQuantityDto);
    return { result: 'OK' };
  }

  @Post('/update-quantity')
  async updateQuantityItem(@Body() countQuantityDto: CountQuantityDto) {
    await this.redisService.updateQuantityItem(countQuantityDto);
    return { result: 'OK' };
  }



}
