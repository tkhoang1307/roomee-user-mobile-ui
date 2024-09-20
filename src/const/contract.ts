export enum ContractEndPoints {
  CREATE_CONTRACT = '/api/contract',
  CONTRACT = '/api/contract',
  GET_CONTRACTS = '/api/contract',
  GET_CURRENT_CONTRACT = '/api/contract/current',
}

export enum ContractStateEnum {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TERMINATED = 'TERMINATED',
  EXPIRED = 'EXPIRED',
}

export enum OptionsQueryContractEnum {
  THIS_MONTH = 1,
  TWO_MONTHS = 2,
  THREE_MONTHS = 3,
  SIX_MONTHS = 4,
  THIS_YEAR = 12,
  DEFAULT = THIS_YEAR,
}
