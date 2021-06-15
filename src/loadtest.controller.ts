import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import isEmpty from 'lodash/isEmpty';
import { LoadtestTakepiDto } from './dto/loadtest.takepi.dto';
import { LoadtestUpdateQuantityDto } from './dto/loadtest.updateQuantity.dto';
import { LoadtestTakepiItemDto } from './dto/loadtest.takepi.item.dto';
import { stores } from './stores';

const axios = require('axios').default;
const get = require('lodash/get');
const chunk = require('lodash/chunk');
const take = require('lodash/take');
const shuffle = require('lodash/shuffle');

const baseUrl = 'https://mpos-api.stage.pnj.io/pi/v1';
const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 200000,
  headers: {
    'Access-Control-Expose-Headers': 'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer eyJraWQiOiJSNGo4RnFXaDNmSk1pU1F6REp2OU02STM3eFwvNkQwZTJCRldFXC9pem5kRlE9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoidVZZS1pyUGc2cXFieThEQVQ2UnlYQSIsInN1YiI6ImQ1ODY4MjNlLTM1Y2EtNDJlMi04MGIxLWQzOWU0YzBmMDhiNSIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX2xiNnN0MlM1bl9QTkotU2lnbkluIl0sImN1c3RvbTplbXBpZCI6IjE5ODkyIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2xiNnN0MlM1biIsImNvZ25pdG86dXNlcm5hbWUiOiJQTkotU2lnbkluX3BodW9uZy5udHZAcG5qLmNvbS52biIsIm5vbmNlIjoiaFBxMUFzdFdoWmNPQzhSNDlEOHZ5VTRqeExKRXNPY2tydjRWVXh0elhoRjBqZDNuZTNXX09aZmwzTFFpVWZEbVpJcnNSZ29LanExZEdlUmZXeEFkX0FCbmVlOVowZ2JLd1V6RjhlMW5tenRYOVFJR3I5OENwLWFxOGFsS2IzVkRVclVHYzJ3ZmEyYlYwMVhKbnNZNGVQTDZPbVExcDFveWNaVWdvWmU3UndZIiwiY3VzdG9tOmNvbXBhbnluYW1lIjoiUE5KIiwiY3VzdG9tOmFkLWdyb3VwIjoiW2RiZWFjZmFhLWJlNmMtNDQ2OS04NjIzLTViNzI0NDIwMTZkNSwgZDY1OTI1M2UtZTk2Zi00ZjRhLTkyYjYtY2QzNzQ3NDZhODI5LCBkMmNhYWEyZi01OTdlLTQ2ZDgtYTc2Mi1iY2QyYmNkMzZjM2QsIDIzNmQ5MWMxLWE1YjAtNGMzNy05ZWMyLWQxYjU3MjBjOWRkMSwgMDBiZTQxNDItMzY2OS00ZmIwLWI5NTktNzgxY2U0NjczYjJmLCBiNmYyZWM2OC1kZWZiLTQ3NjYtOGIzOS05NDBkYWY4MjdjYzMsIGY4ZGIxYjk5LTA4MDctNDVlYS1iNjQxLWMxNTBiODA5YTgxMCwgZGRmMjYyMmUtNjI4My00MDExLTkwZTAtNTQ2YWI0OGM4ZDcyLCBhYmU5YjFiZS04OGFmLTQ4ZWYtODQwZC1hNTlkMGI1Yjk4ZDgsIDhmY2UwYmIyLWRhODUtNDgyMC1iZWQ2LWU1MGZmNGM3NmNjOCwgNGZiYTA1YjUtOTY1Mi00N2ZhLTgxNTQtODZlNWNjMzE1NWJhLCAyOTljMWQ2Yy1hNWRhLTRkYmYtODczOS02OTkwYzkxZjZhN2RdIiwiYXVkIjoiNHI3YjZvM3JoNjQ2NHMxZDFpbjBoZWRma2EiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiJwaHVvbmcubnR2QHBuai5jb20udm4iLCJwcm92aWRlck5hbWUiOiJQTkotU2lnbkluIiwicHJvdmlkZXJUeXBlIjoiU0FNTCIsImlzc3VlciI6Imh0dHBzOlwvXC9zdHMud2luZG93cy5uZXRcLzZlYTgzOGYwLWY1MjktNDU1ZS05NzM4LTE0NzA2MDk5MGI1NVwvIiwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2MTU0NTYwNDYwNTAifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjIxOTA4Mjc4LCJleHAiOjE2MjE5OTQ2NzgsImlhdCI6MTYyMTkwODI3OCwiZW1haWwiOiJwaHVvbmcubnR2QHBuai5jb20udm4ifQ.j07n9KzZFcWcUAom8l8yJZTaFhXF9y-9XR-j6uuMUtoXcvMzvd3D28ApyMQDWR3gqayt5bJA35jUFQ7x7ByGc-Vy3fDdDe02Ga4-90lthAwek2fjiQQ_nsqN2UlTEs_imEdDKKXQ_H0tCmdWnfVodYxg-wEpJKzB_Bbrh4GxTQayViVq6ghfqgeVigifujZMpLLcsTE0iw7Vl-DMxjhvdpPyIqlb7bS7a_vHRiz0U-fvfYssMsyXh1KZl0A6C801_qux_XP2fXLdCEU79tMCDid5C99g2LBPN8c1s9JEwJMSUnfFGuyKWxIzGTsd0uZDp1uPL6qph2qZW4LV3RO1CQ'
  },
});

const _getErrorMessageV2 = (err) => {
  const error = err.response || {};
  const errorCode = error.status;
  const { data } = error;
  if (errorCode === 400 && data.error && isEmpty(data.message)) {
    return 'bad_request';
  }
  if (data) {
    if (data.description) {
      return error.response.data.description;
    }

    if (data.message) {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }
  }
  return err.message || 'Something went wrong!!!';
};
const _randomInt = (min, max) => {
  return Math.floor(Math.random() * max) + min; // returns a random integer from 1 to 100
};

@Controller('loadtest')
export class LoadtestController {
  constructor() {
  }

  @Get('/docs/:storeId')
  async getAllDocByStore(@Param('storeId') storeId: string) {
    return this.doGetDocByStore(storeId);
  }

  async doGetDocByStore(storeId, limit = 5) {
    const url = `physical-inventory-document`;
    return axiosInstance.get(url, {
      params: {
        storeId,
        limit,
      },
    }).then((resp) => {
      return { storeId, data: resp.data };
    }).catch(err => {
      console.log(err.data);
      return _getErrorMessageV2(err);
    });
  }

  @Post('/take')
  async takeDocument(@Body() loadtestTakepiDto: LoadtestTakepiDto) {
    return this.doTake(loadtestTakepiDto);
  }

  async doTake(loadtestTakepiDto: LoadtestTakepiDto) {
    const url = `physical-inventory-document/take`;
    return axiosInstance.post(url, loadtestTakepiDto).then((resp) => {
      return { data: resp.data };
    }).catch(err => {
      console.log(err.data);
      return _getErrorMessageV2(err);
    });
  }

  @Post('/take-and-get')
  async takeDocumentAndGetItems(@Body() loadtestTakepiDto: LoadtestTakepiDto) {
    return this.doGetItems(loadtestTakepiDto);
  }

  async doGetItems(loadtestTakepiDto: LoadtestTakepiDto) {
    const url = `physical-inventory-document/${loadtestTakepiDto.documentData[0].documentId}/items `;
    return axiosInstance.get(url, {
      params: {
        limit: 300,
      },
    }).then((resp) => {
      return { data: resp.data };
    }).catch(err => {
      console.log(err.data);
      return _getErrorMessageV2(err);
    });
  }

  @Post('/update-quantity')
  async updateQuantity(@Body() loadtestUpdateQuantityDto: LoadtestUpdateQuantityDto) {
    return this.doUpdateQuantity(loadtestUpdateQuantityDto);
  }

  async doUpdateQuantity(loadtestUpdateQuantityDto: LoadtestUpdateQuantityDto) {
    const url = `physical-inventory-document/item/update`;
    console.log("Count ",loadtestUpdateQuantityDto.ean11);
    return axiosInstance.post(url, loadtestUpdateQuantityDto).then((resp) => {
      return { data: resp.data };
    }).catch(err => {
      console.log(err.data);
      return _getErrorMessageV2(err);
    });
  }

  @Post('/take-get-and-update-quantity')
  async takeAndUpdateQuantity(@Body() loadtestTakepiDto: LoadtestTakepiDto) {
    return this.doFullFlow(loadtestTakepiDto);
  }

  async doFullFlow(loadtestTakepiDto: LoadtestTakepiDto) {
    await this.doTake(loadtestTakepiDto);
    const respItems = await this.doGetItems(loadtestTakepiDto);
    const items = get(respItems, 'data.data');
    const chunkItems = chunk(shuffle(items), 10) || [];

    let resultUpdate = [];
    let count = 0;
    for (let i = 0, l = chunkItems.length; i < l; i++) {
      await Promise.all(chunkItems[i].map(async (item) => {
        console.log('ean11==>' + item['ean11']);
        let payload = new LoadtestUpdateQuantityDto();
        payload.ean11 = item['ean11'];
        payload.quantity = _randomInt(1, 3);
        payload.documentIds = item['physical_inventory_document_id'];
        const r = await this.doUpdateQuantity(payload);
        count++;
        resultUpdate.push(r);
      }));
    }

    //submit
    let submitResult = await this.doSubmit(loadtestTakepiDto.documentData[0].documentId);
    return { total: items.length, count, resultUpdate, submitResult };
  }

  @Get('/mass')
  async mass() {
    const chunkStore = chunk(shuffle(stores), 10);
    let maxbatch = 20;
    let result = [];
    for (let i = 0, l = chunkStore.length; i < maxbatch; i++) {
      let r = await this.doMassTest(chunkStore[i]);
      console.log(r);
      // result.push(r);
    }

    return result;
  }

  @Get('/mass-v2')
  async massV2() {
    const chunkStore = chunk(shuffle(stores), 5);
    let maxbatch = 50;
    maxbatch  = chunkStore.length;
    let result = [];
    for (let i = 0, l = chunkStore.length; i < maxbatch; i++) {
      let r = await this.doMassTest(chunkStore[i]);
      console.log(r);
      // result.push(r);
    }

    return result;

  }

  @Post('/submit/:documentIds')
  async submit(@Param('documentIds') documentIds: string) {
    return this.doSubmit(documentIds);
  }

  async doMassTest(storeIds) {
    let datas = [];
    await Promise.all(storeIds.map(async (storeId) => {
        const resp = await this.doGetDocByStore(storeId);
        const docs = get(resp, 'data.data', []);
        await docs.map((doc) => {
          datas.push({
            'sapDocNum': doc['sap_doc_num'],
            'stockType': doc['stock_type'],
            'documentId': doc['id'],
          });
        });

      }),
    );
    console.log(datas);
    const result = [];
    const r = await this.doMassDoc(datas);
    // result.push(r);
    return result;
  }

  async doMassDoc(datas) {
    const result = [];
    await Promise.all(datas.map(async (data) => {
      let payload = new LoadtestTakepiDto();
      let _docItemData = new LoadtestTakepiItemDto();
      _docItemData.documentId = '' + data['documentId'];
      _docItemData.stockType = data['stockType'];
      _docItemData.sapDocNum = data['sapDocNum'];

      payload.documentData = [_docItemData];
      payload.userId = '' + _randomInt(1, 100);
      const r = await this.doFullFlow(payload);
      console.log('Done docNUM =====>' + data['sapDocNum']);
      // result.push({
      //   data,
      //   r,
      // });
    }));

    return {
      result,
    };
  }

  async doSubmit(documentIds) {
    const url = `physical-inventory-document/submit`;
    console.log("Submit",documentIds);
    return axiosInstance.post(url, {
      documentIds,
      action: 'submit',
      fiscalYear: '2021',
    }).then((resp) => {
      return { data: resp.data };
    }).catch(err => {
      console.log(err.data);
      return _getErrorMessageV2(err);
    });
  }

}
