import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { authentication } from "../config";
import {createUserWithEmailAndPassword} from "firebase/auth";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileColor, setProfileColor] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      // Update user profile with name and color
      await userCredential.user.updateProfile({
        displayName: name,
        photoURL: profileColor,  // Could be a hex color for profile
      });
      Alert.alert('Registration successful', 'You can now login');
      navigation.navigate('Login');  // Redirect to login after successful register
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Profile Color (Hex)" value={profileColor} onChangeText={setProfileColor} />
      <Button title="Register" onPress={handleRegister} />
      <Text onPress={() => navigation.navigate('Login')}>Already have an account? Login here</Text>
    </View>
  );
};

export default Register;
