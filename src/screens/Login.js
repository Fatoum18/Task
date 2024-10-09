import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { authentication } from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(authentication, email, password);
      navigation.navigate('Home');  // Redirect to Home after successful login
    } catch (error) {
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('Register')}>Don't have an account? Register here</Text>
    </View>
  );
};

export default Login;