import {
  defineAbility,
  AbilityTuple,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';

import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {UserRoles} from '@const/user';
import {UserState} from '@models/user';

function updateAbility(
  ability: MongoAbility<AbilityTuple, MongoQuery>,
  user?: UserState,
) {
  const newAbility = defineAbility(can => {
    if (user?.role === UserRoles.OWNER) {
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.MANAGER_TAB);
      //  can(AbilityActionEnum.CREATE, AbilitySubjectEnum.ACCOMODATION);
      //  can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ACCOMODATION);
      //  can(AbilityActionEnum.REMOVE, AbilitySubjectEnum.ACCOMODATION);
      //  can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ROOM);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ACCOMODATION);
      can(AbilityActionEnum.REMOVE, AbilitySubjectEnum.ACCOMODATION);
      can(AbilityActionEnum.UPSERT, AbilitySubjectEnum.OWNER_ID_CARD);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.PAYMENT_INFORMATION);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.PAYMENT_INFORMATION);
      can(AbilityActionEnum.REMOVE, AbilitySubjectEnum.PAYMENT_INFORMATION);
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.OWNER_INFOR);
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.LIST_MANAGERS_OF_OWNER);
    }
    if (user?.role === UserRoles.OWNER || user?.role === UserRoles.MANAGER) {
      can(AbilityActionEnum.REMOVE, AbilitySubjectEnum.ROOM);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ROOM);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.ROOM);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.CONTRACT);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.ROOM_SERVICE);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.ACCOMMODATION_SERVICE);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.TENANT);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.TENANT);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.CONTRACT);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ROOM_SERVICE);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ACCOMMODATION_SERVICE);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.RULE);
      can(AbilityActionEnum.REMOVE, AbilitySubjectEnum.ACCOMMODATION_SERVICE);
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.REPORT);
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.LIST_TENANTS);
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.LIST_CONTRACTS);
      can(AbilityActionEnum.ACCESS, AbilitySubjectEnum.TENANTS);
      can(AbilityActionEnum.ACCESS, AbilitySubjectEnum.REPORT);
      can(AbilityActionEnum.ACCESS, AbilitySubjectEnum.REQUESTS);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.INVOICE);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.INVOICE);
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.INVOICE_FILTER_DRAFT);
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.INVOICE_FILTER_PAID);
      can(
        AbilityActionEnum.FILTER,
        AbilitySubjectEnum.INVOICE_FILTER_PARTIAL_PAID,
      );
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.INVOICE_FILTER_UN_PAID);
      can(AbilityActionEnum.CREATE, AbilitySubjectEnum.ROOM_PROPERTY);
      can(AbilityActionEnum.EDIT, AbilitySubjectEnum.ROOM_PROPERTY);
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.ROOM);
    }
    if (user?.role === UserRoles.MANAGER) {
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.PAYMENT_INFORMATION);
    }
    if (user?.role === UserRoles.TENANT) {
      can(AbilityActionEnum.VIEW, AbilitySubjectEnum.PAYMENT_INFORMATION);
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.INVOICE_FILTER_PAID);
      can(
        AbilityActionEnum.FILTER,
        AbilitySubjectEnum.INVOICE_FILTER_PARTIAL_PAID,
      );
      can(AbilityActionEnum.FILTER, AbilitySubjectEnum.INVOICE_FILTER_UN_PAID);
    }
  });

  ability.update(newAbility.rules);
}

export default () => defineAbility(() => {});

export {updateAbility};
