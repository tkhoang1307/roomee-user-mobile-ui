export interface UserDetailModel {
  key: React.Key;
  username: string;
  name: string;
  id: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneNumber: string;
  role: 'TENANT' | 'OWNER' | 'MANAGER';
  roleId: string;
  imageUrl: string;
  birthday: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
}

export interface UserState {
  username: string;
  name: string;
  id: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneNumber: string;
  role: string;
  roleId: string;
  imageUrl: string;
  birthday: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
}

export interface UsersWithPagination {
  total: number;
  managers: UserDetailModel[];
}

export interface UserFavAccom {
  userId: string;
  accomId: string;
}
