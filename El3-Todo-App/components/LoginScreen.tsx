import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity  } from "react-native";
import { useAuth } from "./Authentication/Auth"; 

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate("TaskList"); 
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupLink}>
          Don't have an account? Sign up here
        </Text>
          </TouchableOpacity>
          
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  signupLink: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});

export default LoginScreen;
