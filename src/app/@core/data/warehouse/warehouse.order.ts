import BaseModel, {IModel} from '../base';
import {ICustomer} from '../system/customer';
import {Constants} from '../constants/warehouse.order.constants';
import WAREHOUSE_ORDER_TYPE = Constants.WarehouseConstants.WarehouseOrderConstants.WAREHOUSE_ORDER_TYPE;
import WAREHOUSE_ORDER_STATUS = Constants.WarehouseConstants.WarehouseOrderConstants.WAREHOUSE_ORDER_STATUS;

export interface IWarehouseOrder extends IModel {
    // Mã phiếu
    order_code: string;
    // Loại phiếu
    order_type: WAREHOUSE_ORDER_TYPE | WAREHOUSE_ORDER_TYPE.SALE;
    // Người bán
    sales_person: string;
    // Ngày hóa đơn
    order_date: number;
    // Tình trạng phiếu
    order_status: WAREHOUSE_ORDER_STATUS | WAREHOUSE_ORDER_STATUS.DRAFT;
    // Tên người giao hàng đến
    ship_to_name: string;
    // Tên công ty giao hàng đến
    ship_to_company?: string | null;
    // Địa chỉ giao hàng đến
    ship_to_street_address: string;
    // Thành phố giao hàng đến
    ship_to_city?: string | null;
    // Tỉnh giao hàng đến
    ship_to_state_province?: string | null;
    // Zip code giao hàng đến
    ship_to_zip_code?: string | null;
    // Quốc gia giao hàng đến
    ship_to_country?: string | null;
    // Điện thoại giao hàng đến
    ship_to_tel?: string | null;
    // Fax giao hàng đến
    ship_to_fax?: string | null;
    // Email giao hàng đến
    ship_to_email?: string | null;
    // Ngày giao hàng dự kiến
    expected_delivery_date?: number | null;
    // Ngày giao hàng
    shipment_date?: number | null;
    // Điều khoản thanh toán
    payment_terms?: string | null;
    // Phương thức vận chuyển
    delivery_method?: string | null;
    // Tổng tiền
    sub_total: number;
    // Tỷ lệ giảm giá
    discount_rate?: number | null;
    // Số tiền giảm giá
    discount_amount?: number | null;
    // Tỷ lệ thuế
    tax_rate?: number | null;
    // Tiền thuế
    tax_amount?: number | null;
    // Chi phí vận chuyển
    shipping_charges?: number | null;
    // Phí khác
    other_amount?: number | null;
    // Tổng tiền
    total: number;
    // Điều khoản
    terms_conditions?: string | null;
    // Ghi chú
    order_remark?: string | null;
    // Tập tin đính kèm
    file_attach?: string | null;

    // foreign keys
    // Mã nhà cung cấp
    vendor_id?: string | null;
    vendor?: ICustomer | null;
    // Mã khách hàng
    customer_id?: string | null;
    customer?: ICustomer | null;
}

export default class WarehouseOrder extends BaseModel implements IWarehouseOrder {
    constructor(public id: string, public order_code: string,
                public order_type: WAREHOUSE_ORDER_TYPE | WAREHOUSE_ORDER_TYPE.SALE,
                public sales_person: string, public order_date: number,
                public order_status: WAREHOUSE_ORDER_STATUS | WAREHOUSE_ORDER_STATUS.DRAFT,
                public ship_to_name: string, public ship_to_street_address: string,
                public sub_total: number, public total: number) {
        super(id);
    }
}