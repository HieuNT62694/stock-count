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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadtestController = void 0;
const common_1 = require("@nestjs/common");
const isEmpty_1 = require("lodash/isEmpty");
const loadtest_takepi_dto_1 = require("./dto/loadtest.takepi.dto");
const loadtest_updateQuantity_dto_1 = require("./dto/loadtest.updateQuantity.dto");
const loadtest_takepi_item_dto_1 = require("./dto/loadtest.takepi.item.dto");
const stores_1 = require("./stores");
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
        'Authorization': 'Bearer eyJraWQiOiJSNGo4RnFXaDNmSk1pU1F6REp2OU02STM3eFwvNkQwZTJCRldFXC9pem5kRlE9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiQ3dpblctOFZMdHItYjkxUmJkdkIzZyIsInN1YiI6ImQ1ODY4MjNlLTM1Y2EtNDJlMi04MGIxLWQzOWU0YzBmMDhiNSIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX2xiNnN0MlM1bl9QTkotU2lnbkluIl0sImN1c3RvbTplbXBpZCI6IjE5ODkyIiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2xiNnN0MlM1biIsImNvZ25pdG86dXNlcm5hbWUiOiJQTkotU2lnbkluX3BodW9uZy5udHZAcG5qLmNvbS52biIsIm5vbmNlIjoiLVhBNjRSZUMtTjJqNGNkSml6b2JkdVhySUxrY25FYU1VbzhuRHVRMTV1eDQ5LUtSTmRUV2dhRE43bGNMaGoxUHQyLVh1SVVuSzNQZUZkdUZwUWl3dGNPcWdoaEhKUEgydUpHd2dwTWxEQlZXLUxlUjN3dEVtY2phNXoxY1hCTEIzOGZXSWhFai1nSkFSU0JUZ0RKdTFsRzU3Nlh0Q1ZlZnJCM2ZaSjR2TnVBIiwiY3VzdG9tOmNvbXBhbnluYW1lIjoiUE5KIiwiY3VzdG9tOmFkLWdyb3VwIjoiW2RiZWFjZmFhLWJlNmMtNDQ2OS04NjIzLTViNzI0NDIwMTZkNSwgZDY1OTI1M2UtZTk2Zi00ZjRhLTkyYjYtY2QzNzQ3NDZhODI5LCBkMmNhYWEyZi01OTdlLTQ2ZDgtYTc2Mi1iY2QyYmNkMzZjM2QsIDIzNmQ5MWMxLWE1YjAtNGMzNy05ZWMyLWQxYjU3MjBjOWRkMSwgMDBiZTQxNDItMzY2OS00ZmIwLWI5NTktNzgxY2U0NjczYjJmLCBiNmYyZWM2OC1kZWZiLTQ3NjYtOGIzOS05NDBkYWY4MjdjYzMsIGY4ZGIxYjk5LTA4MDctNDVlYS1iNjQxLWMxNTBiODA5YTgxMCwgZGRmMjYyMmUtNjI4My00MDExLTkwZTAtNTQ2YWI0OGM4ZDcyLCBhYmU5YjFiZS04OGFmLTQ4ZWYtODQwZC1hNTlkMGI1Yjk4ZDgsIDhmY2UwYmIyLWRhODUtNDgyMC1iZWQ2LWU1MGZmNGM3NmNjOCwgNGZiYTA1YjUtOTY1Mi00N2ZhLTgxNTQtODZlNWNjMzE1NWJhLCAyOTljMWQ2Yy1hNWRhLTRkYmYtODczOS02OTkwYzkxZjZhN2RdIiwiYXVkIjoiNHI3YjZvM3JoNjQ2NHMxZDFpbjBoZWRma2EiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiJwaHVvbmcubnR2QHBuai5jb20udm4iLCJwcm92aWRlck5hbWUiOiJQTkotU2lnbkluIiwicHJvdmlkZXJUeXBlIjoiU0FNTCIsImlzc3VlciI6Imh0dHBzOlwvXC9zdHMud2luZG93cy5uZXRcLzZlYTgzOGYwLWY1MjktNDU1ZS05NzM4LTE0NzA2MDk5MGI1NVwvIiwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2MTU0NTYwNDYwNTAifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjIxODM4NDQ1LCJleHAiOjE2MjE5MjQ4NDUsImlhdCI6MTYyMTgzODQ0NSwiZW1haWwiOiJwaHVvbmcubnR2QHBuai5jb20udm4ifQ.u82cyjilTsdjOaYFr3O2UuTbzsFL9DnjKHPSn8YbqXLXh-ec16_Kl91eUYLQhTM9SarZTFoT5WJkvWSBNpD7pYu6694O89WFPcFWAtldBOZyvWYGq_0jCgILPdSTy0A_v3ozmC2lpH_NFh7lrNoKJwE4pQR1mXWsB5uypQj8Y7aMV_hakOh2Q3tM8wxbynasXxv9J2U6FDt9dWSx7F09AII_7z6WiIQ9tmvAZe236nXRE-rmV-Csla84TdvKtXiAz3VfDaiuE7bDYem0F_lN2GrVeHuRlnzxjQaPwEMw-fiBNdC1Q5Qciblq5c_ormPnJ3pYDch04Q5S7HurYEkyGw'
    },
});
const _getErrorMessageV2 = (err) => {
    const error = err.response || {};
    const errorCode = error.status;
    const { data } = error;
    if (errorCode === 400 && data.error && isEmpty_1.default(data.message)) {
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
    return Math.floor(Math.random() * max) + min;
};
let LoadtestController = class LoadtestController {
    constructor() {
    }
    async getAllDocByStore(storeId) {
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
    async takeDocument(loadtestTakepiDto) {
        return this.doTake(loadtestTakepiDto);
    }
    async doTake(loadtestTakepiDto) {
        const url = `physical-inventory-document/take`;
        return axiosInstance.post(url, loadtestTakepiDto).then((resp) => {
            return { data: resp.data };
        }).catch(err => {
            console.log(err.data);
            return _getErrorMessageV2(err);
        });
    }
    async takeDocumentAndGetItems(loadtestTakepiDto) {
        return this.doGetItems(loadtestTakepiDto);
    }
    async doGetItems(loadtestTakepiDto) {
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
    async updateQuantity(loadtestUpdateQuantityDto) {
        return this.doUpdateQuantity(loadtestUpdateQuantityDto);
    }
    async doUpdateQuantity(loadtestUpdateQuantityDto) {
        const url = `physical-inventory-document/item/update`;
        console.log("Count ", loadtestUpdateQuantityDto.ean11);
        return axiosInstance.post(url, loadtestUpdateQuantityDto).then((resp) => {
            return { data: resp.data };
        }).catch(err => {
            console.log(err.data);
            return _getErrorMessageV2(err);
        });
    }
    async takeAndUpdateQuantity(loadtestTakepiDto) {
        return this.doFullFlow(loadtestTakepiDto);
    }
    async doFullFlow(loadtestTakepiDto) {
        await this.doTake(loadtestTakepiDto);
        const respItems = await this.doGetItems(loadtestTakepiDto);
        const items = get(respItems, 'data.data');
        const chunkItems = chunk(shuffle(items), 10) || [];
        let resultUpdate = [];
        let count = 0;
        for (let i = 0, l = chunkItems.length; i < l; i++) {
            await Promise.all(chunkItems[i].map(async (item) => {
                console.log('ean11==>' + item['ean11']);
                let payload = new loadtest_updateQuantity_dto_1.LoadtestUpdateQuantityDto();
                payload.ean11 = item['ean11'];
                payload.quantity = _randomInt(1, 3);
                payload.documentIds = item['physical_inventory_document_id'];
                const r = await this.doUpdateQuantity(payload);
                count++;
                resultUpdate.push(r);
            }));
        }
        let submitResult = await this.doSubmit(loadtestTakepiDto.documentData[0].documentId);
        return { total: items.length, count, resultUpdate, submitResult };
    }
    async mass() {
        const chunkStore = chunk(shuffle(stores_1.stores), 10);
        let maxbatch = 20;
        let result = [];
        for (let i = 0, l = chunkStore.length; i < maxbatch; i++) {
            let r = await this.doMassTest(chunkStore[i]);
            console.log(r);
        }
        return result;
    }
    async massV2() {
        const chunkStore = chunk(shuffle(stores_1.stores), 5);
        let maxbatch = 50;
        maxbatch = chunkStore.length;
        let result = [];
        for (let i = 0, l = chunkStore.length; i < maxbatch; i++) {
            let r = await this.doMassTest(chunkStore[i]);
            console.log(r);
        }
        return result;
    }
    async submit(documentIds) {
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
        }));
        console.log(datas);
        const result = [];
        const r = await this.doMassDoc(datas);
        return result;
    }
    async doMassDoc(datas) {
        const result = [];
        await Promise.all(datas.map(async (data) => {
            let payload = new loadtest_takepi_dto_1.LoadtestTakepiDto();
            let _docItemData = new loadtest_takepi_item_dto_1.LoadtestTakepiItemDto();
            _docItemData.documentId = '' + data['documentId'];
            _docItemData.stockType = data['stockType'];
            _docItemData.sapDocNum = data['sapDocNum'];
            payload.documentData = [_docItemData];
            payload.userId = '' + _randomInt(1, 100);
            const r = await this.doFullFlow(payload);
            console.log('Done docNUM =====>' + data['sapDocNum']);
        }));
        return {
            result,
        };
    }
    async doSubmit(documentIds) {
        const url = `physical-inventory-document/submit`;
        console.log("Submit", documentIds);
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
};
__decorate([
    common_1.Get('/docs/:storeId'),
    __param(0, common_1.Param('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "getAllDocByStore", null);
__decorate([
    common_1.Post('/take'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loadtest_takepi_dto_1.LoadtestTakepiDto]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "takeDocument", null);
__decorate([
    common_1.Post('/take-and-get'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loadtest_takepi_dto_1.LoadtestTakepiDto]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "takeDocumentAndGetItems", null);
__decorate([
    common_1.Post('/update-quantity'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loadtest_updateQuantity_dto_1.LoadtestUpdateQuantityDto]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "updateQuantity", null);
__decorate([
    common_1.Post('/take-get-and-update-quantity'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loadtest_takepi_dto_1.LoadtestTakepiDto]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "takeAndUpdateQuantity", null);
__decorate([
    common_1.Get('/mass'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "mass", null);
__decorate([
    common_1.Get('/mass-v2'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "massV2", null);
__decorate([
    common_1.Post('/submit/:documentIds'),
    __param(0, common_1.Param('documentIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoadtestController.prototype, "submit", null);
LoadtestController = __decorate([
    common_1.Controller('loadtest'),
    __metadata("design:paramtypes", [])
], LoadtestController);
exports.LoadtestController = LoadtestController;
//# sourceMappingURL=loadtest.controller.js.map