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
        placeholderTextColor="#F0F8FF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#F0F8FF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.login} >
        <Button title="Login" color ="#fdba74" onPress={handleLogin} />
      </View>
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
    backgroundColor: "#fdba74",
  },
  input: {
    height: 40,
    borderColor: "#eef2ff",
    color: "#F0F8FF",
    fontSize: 16,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  signupLink: {
    marginTop: 20,
    color: "#F0F8FF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  login: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
});

export default LoginScreen;
