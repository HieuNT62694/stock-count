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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const redis_service_1 = require("./services/redis-service");
const _get = require('lodash/get');
let AppService = class AppService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    getHello() {
        return 'Hello World!';
    }
    async doSyncDocumentItem(sapDocNum, payload) {
        const tableName = `pi_doc_items_${sapDocNum}`;
        const rawCheckTableExist = `DESCRIBE ${tableName}`;
        const entityManager = typeorm_1.getManager();
        try {
            await entityManager.query(rawCheckTableExist);
        }
        catch (err) {
            const sqlCreateTable = `
      CREATE TABLE \`${tableName}\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`sap_item_num\` varchar(100) NOT NULL,
  \`material_num\` varchar(100) DEFAULT NULL,
  \`ean11\` varchar(100) DEFAULT NULL,
  \`batch\` varchar(100) DEFAULT NULL,
  \`special_stock\` varchar(100) DEFAULT NULL,
  \`zero_count\` varchar(100) DEFAULT NULL,
  \`base_unit_if_measure\` varchar(100) DEFAULT NULL,
  \`book_quantity\` int DEFAULT NULL,
  \`quantity\` int DEFAULT NULL,
  \`status\` varchar(100) DEFAULT NULL,
  \`sap_result\` json DEFAULT NULL,
  \`is_deleted\` tinyint(1) DEFAULT '0',
  \`batch_process_id\` varchar(150) DEFAULT NULL,
  \`created_at\` datetime DEFAULT NULL,
  \`created_by\` varchar(150) DEFAULT NULL,
  \`updated_at\` datetime DEFAULT NULL,
  \`updated_by\` varchar(150) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`status_IDX\` (\`status\`) USING BTREE,
  KEY \`batch_process_IDX\` (\`batch_process_id\`) USING BTREE,
  KEY \`created_at_IDX\` (\`created_at\`) USING BTREE,
  KEY \`updated_at_IDX\` (\`updated_at\`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      
      `;
            await entityManager.query(sqlCreateTable);
        }
        await entityManager.query(' INSERT INTO ' + tableName + ' (`sap_item_num`, `material_num`, `ean11`, `batch`, `special_stock`, `zero_count`, `base_unit_if_measure`, `book_quantity`, `quantity`, `status`, `sap_result`, `is_deleted`, `batch_process_id`, `created_at`, `created_by`, `updated_at`, `updated_by`)\n' +
            'VALUES\n' +
            '\t( \'106\', \'SCXM00K000065.400\', \'2050001414861\', \'1245000416\', \'\', \'\', \'EA\', 1, 1, \'counted\', NULL, 0, \'0100072248-1617160894944\', \'2021-03-31 02:45:18\', \'PHUONG.NTV\', \'2021-03-31 03:26:48\', NULL),\n' +
            '\t(\'107\', \'SCXM00K000065.440\', \'2050003874236\', \'1249001141\', \'\', \'\', \'EA\', 1, 1, \'counted\', NULL, 0, \'0100072248-1617160894944\', \'2021-03-31 02:45:18\', \'PHUONG.NTV\', \'2021-03-31 03:26:48\', NULL),\n' +
            '\t( \'108\', \'SCXM00K000066.400\', \'2050001459947\', \'1245000418\', \'\', \'\', \'EA\', 1, 1, \'counted\', NULL, 0, \'0100072248-1617160894944\', \'2021-03-31 02:45:18\', \'PHUONG.NTV\', \'2021-03-31 03:26:48\', NULL),\n' +
            '\t( \'109\', \'SCXM00K000067.400\', \'2050001460172\', \'1245000419\', \'\', \'\', \'EA\', 1, 1, \'counted\', NULL, 0, \'0100072248-1617160894944\', \'2021-03-31 02:45:18\', \'PHUONG.NTV\', \'2021-03-31 03:26:48\', NULL);\n');
        return {};
    }
    async takePI(sapDocNum) {
        const tableName = `pi_doc_items_${sapDocNum}`;
        const rawSql = `SELECT quantity, id, ean11, book_quantity, material_num, sap_item_num, updated_at FROM ${tableName}`;
        const entityManager = typeorm_1.getManager();
        const result = await entityManager.query(rawSql);
        console.log({ result });
        result.forEach(async (item) => {
            await this.redisService.initStockItem(sapDocNum, item['id'], item);
        });
        return { result: 'ok' };
    }
    async getItemsFromDB(sapDocNum) {
        const tableName = `pi_doc_items_${sapDocNum}`;
        const rawSql = `SELECT quantity, id, ean11, book_quantity, material_num, sap_item_num, updated_at FROM ${tableName}`;
        const entityManager = typeorm_1.getManager();
        const result = await entityManager.query(rawSql);
        return { result };
    }
    async updateItemFromDB(countQuantityDto) {
        const tableName = `pi_doc_items_${countQuantityDto.sapDocNum}`;
        const rawSql = `UPDATE ${tableName} set quantity=${countQuantityDto.quantity} where id=${countQuantityDto.itemId}`;
        const entityManager = typeorm_1.getManager();
        const result = await entityManager.query(rawSql);
        return { result };
    }
    async syncDataRedisToDB(sapDocNum) {
        const tableName = `pi_doc_items_${sapDocNum}`;
        const sql = `
      
      INSERT INTO ${tableName}
      (name, salary)
      VALUES 
          ('Bob', 1125),
          ('Jane', 1200),
          ('Frank', 1100),
          ('Susan', 1175),
          ('John', 1150)
          ON DUPLICATE KEY UPDATE salary = VALUES(salary);
    
    `;
    }
};
AppService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [redis_service_1.AppRedisService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map