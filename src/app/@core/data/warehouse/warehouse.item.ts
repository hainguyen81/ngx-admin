import {IModel} from '../base';
import {IWarehouseCategory} from './warehouse.category';

export const enum ITEM_STATUS {
    NOT_ACTIVATED,
    ACTIVATED,
    LOCKED,
}

export function convertItemStatusToDisplay(value: ITEM_STATUS): string {
    switch (value) {
        case ITEM_STATUS.ACTIVATED:
            return 'common.enum.warehouseItemStatus.activated';
        case ITEM_STATUS.LOCKED:
            return 'common.enum.warehouseItemStatus.locked';
        default:
            return 'common.enum.warehouseItemStatus.notActivated';
    }
}

export interface IWarehouseItem extends IModel {
    // Mã hàng hóa
    code: string;
    // Tên hàng hóa
    name: string;
    // trạng thái
    status?: ITEM_STATUS | ITEM_STATUS.NOT_ACTIVATED;
    // Mã vạch
    barcode?: string | null;
    // Serial number
    serial?: string | null;
    // Hình ảnh
    image?: string | null;
    // Nước sản xuất
    manufacturer?: string | null;
    // Chiều dài
    length?: number | null;
    // Chiều rộng
    width?: number | null;
    // Chiều cao
    height?: number | null;
    // Cân nặng
    weight?: number | null;
    // Kích thước
    size?: number | null;
    // Đơn vị tính
    unit?: string | null;
    // Tỷ lệ trên mỗi đơn vị tính: Ví dụ 1 két bia = 24 chai
    rate_per_unit?: number | null;
    // Giá đại lý
    dealer_price?: number | null;
    // Giá vốn
    cost_price?: number | null;
    // Giá bán
    selling_price?: number | null;
    // Loại tiền tệ
    currency?: string | null;
    // Tổng số lượng
    stock_on_hand?: number | null;
    // Tổng số lượng trong Sales Orders
    committed_stock?: number | null;
    // Số lượng trong kho
    available_stock?: number | null;
    // Tổng số lượng trong Purchase Orders
    incoming_stock?: number | null;
    // Số lượng được vận chuyển
    quantity_shipped?: number | null;
    // Số lượng được nhận
    quantity_received?: number | null;
    // Mô tả
    description?: string | null;
    // Ghi chú
    remark?: string | null;

    // foreign keys
    // Loại hàng hóa
    categories_id?: String | null;
    category?: IWarehouseCategory | null;
    // Hãng sản xuất
    brand_id?: String | null;
    brand?: IWarehouseCategory | null;
}

export default class WarehouseItem implements IWarehouseItem {
    constructor(
        public id: string,
        public code: string,
        public name: string,
        public status?: ITEM_STATUS | ITEM_STATUS.NOT_ACTIVATED,
        public barcode?: string | null,
        public serial?: string | null,
        public image?: string | null,
        public manufacturer?: string | null,
        public length?: number | null,
        public width?: number | null,
        public height?: number | null,
        public weight?: number | null,
        public size?: number | null,
        public unit?: string | null,
        public rate_per_unit?: number | null,
        public dealer_price?: number | null,
        public cost_price?: number | null,
        public selling_price?: number | null,
        public currency?: string | null,
        public stock_on_hand?: number | null,
        public committed_stock?: number | null,
        public available_stock?: number | null,
        public incoming_stock?: number | null,
        public quantity_shipped?: number | null,
        public quantity_received?: number | null,
        public description?: string | null,
        public remark?: string | null,
        public categories_id?: String | null,
        public category?: IWarehouseCategory | null,
        public brand_id?: String | null,
        public brand?: IWarehouseCategory | null) {
    }
}
