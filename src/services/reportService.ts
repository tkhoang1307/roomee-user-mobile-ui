import {privateAxios} from '@libs/axios';
import {
  AllReports,
  ContractReportModel,
  DensityReportModel,
  ExpenseReportModel,
  InvoiceReportXlsxPayload,
} from '@models/report';
import {EnumReportEndpoints} from '@const/report';

export const getAllReports = async (accommodationId: string) => {
  const res = await privateAxios.get(EnumReportEndpoints.GET_REPORT, {
    params: {
      accommodationId,
    },
  });
  return res?.data as AllReports;
};

export const getDensityReport = async (
  accommodationId: string,
  duration: number,
  unit: string = 'month',
) => {
  const res = await privateAxios.get(EnumReportEndpoints.GET_DENSITY_REPORT, {
    params: {
      accommodationId,
      duration,
      unit,
    },
  });
  return res?.data as DensityReportModel;
};

export const getContractReport = async (
  accommodationId: string,
  duration: number,
  unit: string = 'month',
) => {
  const res = await privateAxios.get(EnumReportEndpoints.GET_CONTRACT_REPORT, {
    params: {
      accommodationId,
      duration,
      unit,
    },
  });
  return res?.data as ContractReportModel;
};

export const getExpenseReport = async (
  accommodationId: string,
  duration: number,
  unit: string = 'month',
) => {
  const res = await privateAxios.get(EnumReportEndpoints.GET_EXPENSE_REPORT, {
    params: {
      accommodationId,
      duration,
      unit,
    },
  });
  return res?.data as ExpenseReportModel;
};

export const generateReport = async (payload: InvoiceReportXlsxPayload) => {
  const res = await privateAxios.post(
    EnumReportEndpoints.EXPORT_INVOICE_REPORT,
    payload,
  );

  return res.data;
};
