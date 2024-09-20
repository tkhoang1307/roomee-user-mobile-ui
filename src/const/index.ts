export * as AuthConst from './auth';
export * as UserConst from './user';
export * as LocationConst from './location';

const DATE_PICKER_FORMAT = 'DD/MM/YYYY';
const MONTH_PICKER_FORMAT = 'MM/YYYY';
const MONEY_FORMAT_BY = /\B(?=(\d{3})+(?!\d))/g;

export { DATE_PICKER_FORMAT, MONEY_FORMAT_BY, MONTH_PICKER_FORMAT };

export enum TagTypeEnum {
    WARNING = 'WARNING',
    INFORMATION = 'INFORMATION',
    SUCCESS = 'SUCCESS',
    DANGER = 'DANGER',
}