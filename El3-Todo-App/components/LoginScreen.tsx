import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "./Authentication/Auth";
import FlashMessage, { showMessage } from "react-native-flash-message";

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
     setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      showMessage({
        message: "Logged in successfully",
        type: "success",
      });
      navigation.navigate("TaskList");
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error logging in",
        type: "danger",
 });
      console.error("Error logging in", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#b0c4de"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b0c4de"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#fdba74" />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupLink}>
          Don't have an account? Sign up here
        </Text>
      </TouchableOpacity>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    color: "#333",
    borderWidth: 1,
borderRadius:10,
    marginBottom: 20,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#60a5fa",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 20,
    color: "#60a5fa",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
