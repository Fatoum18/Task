import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Modal, StyleSheet } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import { authentication, db } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Slider from '@react-native-community/slider';
import AuthContext from "../AuthContext";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileColor, setProfileColor] = useState('#ffffff'); // Default color
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { setRegistering } = useContext(AuthContext);

  const openColorPicker = () => setIsPickerVisible(true);
  const closeColorPicker = () => setIsPickerVisible(false);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "Users", user.uid), {
        name,
        color: profileColor,
        email,
      });
      Alert.alert('Registration successful', 'You can now login');
      navigation.navigate('Login'); // Redirect to login after successful registration
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Name Input */}
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Profile Color Input */}
      <View style={styles.colorPickerContainer}>
        <TextInput
          placeholder="Profile Color (Hex)"
          value={profileColor}
          onChangeText={setProfileColor}
          style={[styles.input, { backgroundColor: profileColor, flex: 1 }]}
        />
        <TouchableOpacity style={styles.colorPickerButton} onPress={openColorPicker}>
          <Text style={styles.buttonText}>Pick Color</Text>
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <Modal visible={isPickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ColorPicker
            sliderComponent={Slider}
            onColorSelected={(color) => {
              setProfileColor(color);
              closeColorPicker();
            }}
            style={styles.colorPicker}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={closeColorPicker}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Already have an account? <Text style={styles.link}>Login here</Text>
      </Text>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#F7F7F7",
  },
  colorPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorPickerButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {
    height: 300,
    width: 300,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});