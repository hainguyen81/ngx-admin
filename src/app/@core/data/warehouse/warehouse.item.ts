import BaseModel, {IModel} from '../base';
import {IWarehouseCategory} from './warehouse.category';
import {Constants} from '../constants/warehouse.item.constants';
import ITEM_STATUS = Constants.WarehouseConstants.WarehouseItemConstants.ITEM_STATUS;

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
    image?: string[] | null;
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
    // Màu sắc
    color?: string | null;
    // Chất liệu
    material?: string | null;
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

export default class WarehouseItem extends BaseModel implements IWarehouseItem {
    constructor(public id: string, public code: string, public name: string) {
        super(id);
    }
}
