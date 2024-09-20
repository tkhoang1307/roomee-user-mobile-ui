import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ManagerStackParamList = {
  ListManagerScreen: undefined;
  CreateManagerAccountScreen: undefined;
};

export type ListManagerScreenProps = NativeStackScreenProps<
  ManagerStackParamList,
  'ListManagerScreen'
>;

export type CreateManagerAccountScreenProps = NativeStackScreenProps<
  ManagerStackParamList,
  'CreateManagerAccountScreen'
>;
