import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type TabParamList = {
  Discover: undefined;
  Districts: undefined;
  Tickets: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Interests: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Activity: { id: string };
  Chat: { activityId: string };
  Organizer: { uid: string };
  CreateActivity: { id?: string };
  Checkout: { activityId: string };
  Settings: undefined;
  Admin: undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
export type ActivityRoute = RouteProp<RootStackParamList, 'Activity'>;

