export enum InvoiceEndPoints {
    GET_ALL_INVOICES = 'api/invoice',
    CREATE_INVOICE = 'api/invoice',
    GET_ALL_INVOICES_OF_TENANT = 'api/invoice/tenant',
    GET_DETAIL_INVOICE = 'api/invoice/',
    EDIT_INVOICE = 'api/invoice/',
    DELETE_INVOICE = 'api/invoice/',
    EDIT_INVOICE_ITEM = '/items/batch',
    DELETE_INVOICE_ITEM = '/items/',
    EXPORT_INVOICE = '/edited',
    PAID_INVOICE = '/api/invoice/{id}/paid',
    PARTIAL_PAID_INVOICE = '/api/invoice/{id}/partialPaid',
    REVOKE_INVOICE = '/api/invoice/{id}/backToUnpaid',
    DELETE_OTHER_INVOICE_ITEMS = '/others/',
}

export enum InvoiceStateEnum {
    DRAFT = 'DRAFT',
    UN_PAID = 'UN_PAID',
    PARTIAL_PAID = 'PARTIAL_PAID',
    PAID = 'PAID',
}