import { TenantModel } from "@models/tenant";

export interface InvoiceModel {
    id: string;
    key: string;
    dueDate: string;
    invoiceDate: string;
    name: string;
    state: string;
    amountAfterPromotion: number;
    amountPaid: number;
    meta?: any;
    roomId: string;
}

export interface BasicInvoiceModel {
    id: string;
    dueDate: string;
    name: string;
    state: string;
    invoiceDate: string;
}

export interface InvoiceItemModel {
    id: string;
    roomTenantServiceId: string;
    name: string;
    unit: string;
    cost: number;
    quantity: number;
    meta?: {
        oldIndicator?: number;
        newIndicator?: number;
    };
}

export interface InvoiceOtherItemsModel {
    id: string;
    name: string;
    cost: number;
    quantity: number;
}

export interface DetailInvoiceResponseModel {
    id: string;
    dueDate: string;
    invoiceDate: string;
    name: string;
    state: string;
    amountAfterPromotion: number;
    amountPaid: number;
    items: Array<InvoiceItemModel>;
    tenants: Array<TenantModel>;
    others?: Array<InvoiceOtherItemsModel>;
}

export interface CreationInvoiceRequestModel {
    roomId: string;
    invoiceDate: Date | undefined;
    dueDate: Date | undefined;
    state?: string;
    services: Array<CreationInvoiceItemRequestModel>;
    meta?: any;
}

export interface CreationInvoiceItemRequestModel {
    quantity: number;
    roomTenantServiceId: string;
    meta?: {
        oldIndicator?: number;
        newIndicator?: number;
    }
}

export interface CreationInvoiceItemModel {
    id?: string;
    key: string;
    roomTenantServiceId: string;
    name: string;
    unit: string;
    cost: number;
    quantity: number;
    meta?: {
        oldIndicator?: number;
        newIndicator?: number;
    }
    nameService?: string,
    unitService?: string;
}

export interface CreationInvoiceItemPropertyModel {
    id?: string;
    key: string;
    roomTenantPropertyId: string;
    name: string;
    cost: number;
    quantity: number;
}

export interface InvoiceItemDisplayModel extends InvoiceItemModel {
    displayCost: string;
    displayQuantity: string;
}
