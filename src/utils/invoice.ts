import { InvoiceStateEnum } from "@const/invoice";

export const listInvoiceStates = [
    {
        value: InvoiceStateEnum.DRAFT,
        label: InvoiceStateEnum.DRAFT
    },
    {
        value: InvoiceStateEnum.UN_PAID,
        label: InvoiceStateEnum.UN_PAID
    },
    {
        value: InvoiceStateEnum.PARTIAL_PAID,
        label: InvoiceStateEnum.PARTIAL_PAID
    },
    {
        value: InvoiceStateEnum.PAID,
        label: InvoiceStateEnum.PAID
    },
    {
        value: 'ALL',
        label: 'ALL'
    },
];