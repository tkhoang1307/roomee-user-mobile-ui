export interface ContractReportModel {
  created: number;
  processing: number;
  completed: number;
  failed: number;
  terminated: number;
  expired: number;
}

export interface InvoiceReportXlsxPayload {
  type: string;
  accommodationId: string;
}

export interface DensityReportModel {
  total: number;
  items: [
    {
      name: string;
      quantity: number;
    },
  ];
}

export interface RequestReportModel {
  created: number;
  precessing: number;
  completed: number;
  cancel: number;
}

export interface ExpenseReportModel {
  spend: {
    maintenance: {
      totalAmount: number;
      items: Array<{
        roomName: string;
        spend: Array<{
          roomId: string;
          description: string;
          amount: number;
        }>;
      }>;
    };
  };
  take: {
    rooms: {
      totalAmount: number;
      items: Array<{
        name: string;
        amount: number;
      }>;
    };
  };
}

export interface ExpenseSpendReportModel {
  totalAmount: number;
  items: Array<{
    roomName: string;
    amount: number;
  }>;
}

export interface ExpenseTakeReportModel {
  totalAmount: number;
  items: Array<{
    name: string;
    amount: number;
  }>;
}

export interface AllReports {
  density?: DensityReportModel;
  contract?: ContractReportModel;
  request?: RequestReportModel;
  expense?: ExpenseReportModel;
}
