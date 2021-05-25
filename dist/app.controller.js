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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const redis_service_1 = require("./services/redis-service");
const takepi_dto_1 = require("./dto/takepi.dto");
const sync_doc_item_1 = require("./dto/sync.doc.item");
const countQuantity_dto_1 = require("./dto/countQuantity.dto");
let AppController = class AppController {
    constructor(appService, redisService) {
        this.appService = appService;
        this.redisService = redisService;
    }
    getHello() {
    }
    syncDocItem(syncDocItem, request) {
        return this.appService.doSyncDocumentItem(syncDocItem.sapDocNum, []);
    }
    fakeStock() {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 1000; j++) {
            }
        }
        return { 'ok': '1' };
    }
    async takePI(takepiDto) {
        return this.appService.takePI(takepiDto.sapDocNum);
    }
    async getItemByDocnum(sapDocNum) {
        const data = await this.redisService.getItemsByDocnum(sapDocNum);
        return data;
    }
    async updateQuantityItemV1(countQuantityDto) {
        await this.appService.updateItemFromDB(countQuantityDto);
        return { result: 'OK' };
    }
    async updateQuantityItem(countQuantityDto) {
        await this.redisService.updateQuantityItem(countQuantityDto);
        return { result: 'OK' };
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
__decorate([
    common_1.Post('/sync-doc-item'),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_doc_item_1.SyncDocItem, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "syncDocItem", null);
__decorate([
    common_1.Get('/fake-stock'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "fakeStock", null);
__decorate([
    common_1.Post('/take-pi'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [takepi_dto_1.TakepiDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "takePI", null);
__decorate([
    common_1.Get('/items/:sapDocNum'),
    __param(0, common_1.Param('sapDocNum')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getItemByDocnum", null);
__decorate([
    common_1.Post('/update-quantity-v1'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [countQuantity_dto_1.CountQuantityDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateQuantityItemV1", null);
__decorate([
    common_1.Post('/update-quantity'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [countQuantity_dto_1.CountQuantityDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateQuantityItem", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        redis_service_1.AppRedisService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map