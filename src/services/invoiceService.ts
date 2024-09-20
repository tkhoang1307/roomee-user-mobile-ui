import {InvoiceEndPoints} from '@const/invoice';
import {privateAxios} from '@libs/axios';
import {
  CreationInvoiceRequestModel,
  DetailInvoiceResponseModel,
  InvoiceModel,
} from '@models/invoices';

export const getAllInvoicesOfRoom = async (
  accommodationId: string,
  roomId?: string,
) => {
  const res = await privateAxios.get(
    `${InvoiceEndPoints.GET_ALL_INVOICES}?accommodationId=${accommodationId}&roomId=${roomId}`,
  );
  return res.data as InvoiceModel[];
};

export const createInvoice = async (payload: CreationInvoiceRequestModel) => {
  const res = await privateAxios.post(InvoiceEndPoints.CREATE_INVOICE, payload);
  return res.data as InvoiceModel;
};

export const getDetailInvoice = async (invoiceId: string) => {
  const res = await privateAxios.get(
    InvoiceEndPoints.GET_DETAIL_INVOICE + invoiceId,
  );
  return res.data as DetailInvoiceResponseModel;
};

export const getAllInvoicesOfTenant = async (roomId: string) => {
  const res = await privateAxios.get(
    InvoiceEndPoints.GET_ALL_INVOICES_OF_TENANT + '?roomId=' + roomId,
  );
  return res.data;
};

export const updateInvoiceById = async (invoiceId: string, payload: any) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.EDIT_INVOICE + invoiceId,
    payload,
  );
  return res.data;
};

export const deleteInvoiceById = async (invoiceId: string) => {
  const res = await privateAxios.delete(
    InvoiceEndPoints.DELETE_INVOICE + invoiceId,
  );
  return res.data;
};

export const updateInvoiceItemsOfInvoice = async (
  invoiceId: string,
  payload: any,
) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.EDIT_INVOICE +
      invoiceId +
      InvoiceEndPoints.EDIT_INVOICE_ITEM,
    payload,
  );
  return res.data;
};

export const deleteInvoiceItem = async (
  invoiceId: string,
  invoiceItemId: string,
) => {
  const res = await privateAxios.delete(
    InvoiceEndPoints.DELETE_INVOICE +
      invoiceId +
      InvoiceEndPoints.DELETE_INVOICE_ITEM +
      invoiceItemId,
  );
  return res.data;
};

export const exportInvoiceById = async (invoiceId: string) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.EDIT_INVOICE + invoiceId + InvoiceEndPoints.EXPORT_INVOICE,
  );
  return res.data;
};

export const paidInvoice = async (invoiceId: string) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.PAID_INVOICE.replace('{id}', invoiceId),
  );
  return res.data;
};

export const partialPaidInvoice = async (
  invoiceId: string,
  payload: {currentPaid: number},
) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.PARTIAL_PAID_INVOICE.replace('{id}', invoiceId),
    payload,
  );
  return res.data;
};

export const revokeInvoice = async (invoiceId: string) => {
  const res = await privateAxios.put(
    InvoiceEndPoints.REVOKE_INVOICE.replace('{id}', invoiceId),
  );
  return res.data;
};

export const paginateInvoices = async ({
  accommodationId,
  roomId,
  state,
  startDate,
  endDate,
}: {
  accommodationId: string;
  roomId?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const params = {accommodationId, roomId, state, startDate, endDate};
  const requests = await privateAxios.get<InvoiceModel[]>(
    InvoiceEndPoints.GET_ALL_INVOICES,
    {params},
  );
  return requests.data;
};

export const deleteOtherInvoiceItem = async (
  invoiceId: string,
  invoiceItemId: string
) => {
  const res = await privateAxios.delete(
    InvoiceEndPoints.DELETE_INVOICE +
      invoiceId +
      InvoiceEndPoints.DELETE_OTHER_INVOICE_ITEMS +
      invoiceItemId
  );
  return res.data;
};
