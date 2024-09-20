import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  CreateIdentityCardScreen: undefined;
  EditProfileScreen: undefined;
  ListIdentityCardScreen: undefined;
  DetailLanguageScreen: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ProfileScreen'
>;

export type CreateIdentityCardScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'CreateIdentityCardScreen'
>;

export type EditProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'EditProfileScreen'
>;

export type ListIdentityCardScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'ListIdentityCardScreen'
>;

export type DetailLanguageScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'DetailLanguageScreen'
>;
