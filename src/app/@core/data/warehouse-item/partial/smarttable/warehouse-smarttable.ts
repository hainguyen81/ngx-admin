import {IModel} from '../../../base';

export default interface IWarehouseItemSmartTable extends IModel {
    id: string;
    itemCode: string | null;
    itemName: string | null;
    categoriesId: number | null;
    brandId: number | null;
    itemBarcode: string | null;
    itemSerial: string | null;
    itemImage: string | null;
    itemManufacturer: number | null;
    itemLength: string | null;
    itemWidth: string | null;
    itemHeight: string | null;
    itemWeight: string | null;
    itemSize: string | null;
    itemUnit: number | null;
    itemRatePerUnit: number | null;
    itemDealerPrice: string | null;
    itemCostPrice: string | null;
    itemSellingPrice: string | null;
    itemCurrency: string | null;
    itemStockOnHand: number | null;
    itemCommittedStock: number | null;
    itemAvailableStock: number | null;
    itemIncomingStock: number | null;
    itemQuantityShipped: number | null;
    itemQuantityReceived: number | null;
    itemDescription: number | null;
    itemRemark: string | null;
}

export default class WarehouseItemSmartTable implements IWarehouseItemSmartTable {
    constructor(public id: string,
                public itemCode: string,
                public itemName: string,
                public categoriesId: number,
                public brandId: number,
                public itemBarcode: string,
                public itemSerial: string,
                public itemImage: string,
                public itemManufacturer: number,
                public itemLength: string,
                public itemWidth: string,
                public itemHeight: string,
                public itemWeight: string,
                public itemSize: string,
                public itemUnit: number,
                public itemRatePerUnit: number,
                public itemDealerPrice: string,
                public itemCostPrice: string,
                public itemSellingPrice: string,
                public itemCurrency: string,
                public itemStockOnHand: number,
                public itemCommittedStock: number,
                public itemAvailableStock: number,
                public itemIncomingStock: number,
                public itemQuantityShipped: number,
                public itemQuantityReceived: number,
                public itemDescription: number,
                public itemRemark: string) {
    }
}
