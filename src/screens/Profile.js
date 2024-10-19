import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { authentication, db } from "../config";
import { signOut } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import AuthContext from "../AuthContext";
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileColor, setProfileColor] = useState(profile?.color || "#D3D3D3"); // Default color
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = doc(db, "Users", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
        setName(profileSnap.data().name);
        setProfileColor(profileSnap.data().color);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        name,
        email,
        color: profileColor,
      });
      Alert.alert("Profile updated", "Your profile has been updated successfully.");
    } catch (error) {
      Alert.alert("Update failed", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(authentication);
      Alert.alert("Logged out", "You have been logged out successfully.");
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  // Function to get first two letters of the name
  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "NN";
  };

  // Open/Close Color Picker
  const openColorPicker = () => setIsPickerVisible(true);
  const closeColorPicker = () => setIsPickerVisible(false);

  if (!profile) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Circle with initials */}
      <View style={[styles.avatar, { backgroundColor: profileColor }]}>
        <Text style={styles.avatarText}>{getInitials(name)}</Text>
      </View>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false} // Email should be readonly
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

      {/* Save Profile Button */}
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
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
  logoutButton: {
    backgroundColor: "red",
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});