import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, Modal, StyleSheet } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import { authentication, db } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Slider from '@react-native-community/slider';


const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileColor, setProfileColor] = useState('#ffffff'); // Default color
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const openColorPicker = () => setIsPickerVisible(true);
  const closeColorPicker = () => setIsPickerVisible(false);
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(authentication,email, password);

      const user = userCredential.user;
      await setDoc(doc(db, "Users", user.uid), {
        name,
        color,
        email,
      });
      Alert.alert('Registration successful', 'You can now login');
      navigation.navigate('Login');  // Redirect to login after successful register
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View style={[styles.container]}>
      <TextInput placeholder="Name" style={[styles.input]} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={[styles.input]} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={[styles.input]} secureTextEntry value={password} onChangeText={setPassword} />

      <View style={{  "flexDirection": "row", "gap": 10, marginBottom: 5 }}>
        <TextInput
          placeholder="Profile Color (Hex)"
          value={profileColor}
          onChangeText={setProfileColor}
          style={[styles.input, { backgroundColor: profileColor, "flex": 1 }]}
        />
        <Button title="Pick Color" onPress={openColorPicker}   />
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
          <Button title="Close" onPress={closeColorPicker} />
        </View>
      </Modal>
      <Button title="Register" onPress={handleRegister} />
      <Text style={{marginTop:10}} onPress={() => navigation.navigate('Login')}>Already have an account? Login here</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff"
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
});
export default Register;
