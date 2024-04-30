import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type ParamList = {
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamList {}
  }
}

export const Stack = createNativeStackNavigator<ParamList>();
