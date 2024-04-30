import { Stack } from ".";
import HomeScreen from "../features/home/HomeScreen";
import Header from "./Header";

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
