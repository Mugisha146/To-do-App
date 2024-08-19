import React from "react";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaskList from "./components/TaskList";
import SignupScreen from "./components/SignupScreen";
import LoginScreen from "./components/LoginScreen";
import { AuthProvider } from "./components/Authentication/Auth";

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="TaskList" component={TaskList} />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default App;
