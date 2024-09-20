// User model
export interface UserLoginModel {
  email: string;
  password: string;
}

export interface UserSignupModel {
  telephone: string;
  email: string;
  name: string;
  password: string;
  role: string;
}

export interface MenuItemPropsModel {
  key: string;
  icon: JSX.Element;
  label: JSX.Element | string;
}
