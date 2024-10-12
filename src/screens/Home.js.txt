import React from 'react';
import { View, Text, Button } from 'react-native';
import { authentication } from "../config";
import { signOut,getAuth } from "firebase/auth";


const Home = ({ navigation }) => {
  const user = getAuth().currentUser;

  const handleLogout = () => {
    signOut(authentication).then(() => {
      navigation.replace('Login');
    });
  }; 

  return (
  
    <View>
      
       <Text>Welcome, {user.email}</Text>
      <Text>Profile Color: {user.photoURL}</Text> 
      <Text> Display tasks and other features here </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Home;
