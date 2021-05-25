import { LoadtestTakepiDto } from './dto/loadtest.takepi.dto';
import { LoadtestUpdateQuantityDto } from './dto/loadtest.updateQuantity.dto';
export declare class LoadtestController {
    constructor();
    getAllDocByStore(storeId: string): Promise<any>;
    doGetDocByStore(storeId: any, limit?: number): Promise<any>;
    takeDocument(loadtestTakepiDto: LoadtestTakepiDto): Promise<any>;
    doTake(loadtestTakepiDto: LoadtestTakepiDto): Promise<any>;
    takeDocumentAndGetItems(loadtestTakepiDto: LoadtestTakepiDto): Promise<any>;
    doGetItems(loadtestTakepiDto: LoadtestTakepiDto): Promise<any>;
    updateQuantity(loadtestUpdateQuantityDto: LoadtestUpdateQuantityDto): Promise<any>;
    doUpdateQuantity(loadtestUpdateQuantityDto: LoadtestUpdateQuantityDto): Promise<any>;
    takeAndUpdateQuantity(loadtestTakepiDto: LoadtestTakepiDto): Promise<{
        total: any;
        count: number;
        resultUpdate: any[];
        submitResult: any;
    }>;
    doFullFlow(loadtestTakepiDto: LoadtestTakepiDto): Promise<{
        total: any;
        count: number;
        resultUpdate: any[];
        submitResult: any;
    }>;
    mass(): Promise<any[]>;
    massV2(): Promise<any[]>;
    submit(documentIds: string): Promise<any>;
    doMassTest(storeIds: any): Promise<any[]>;
    doMassDoc(datas: any): Promise<{
        result: any[];
    }>;
    doSubmit(documentIds: any): Promise<any>;
}
