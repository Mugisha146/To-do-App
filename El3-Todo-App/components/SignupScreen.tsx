import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "./Authentication/Auth";

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { signup } = useAuth();

  const handleSignup = async () => {
    try {
      await signup(email, password, firstName, lastName);
      navigation.navigate("Login"); 
    } catch (error) {
      console.error("Error signing up", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#F0F8FF"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#F0F8FF"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <View style={styles.register}>
        <Button title="Sign Up" color="#fdba74" onPress={handleSignup} />
      </View>
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
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  register: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
});

export default SignupScreen;
