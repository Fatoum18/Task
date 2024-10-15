import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { authentication } from "./src/config";
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import TasksScreen from './src/screens/Tasks';
import HomeScreen from './src/screens/Home';
import ProfileScreen from './src/screens/Profile';
import LoadingScreen from './src/screens/Loading';
import TaskDetailScreen from './src/screens/TaskDetail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { onAuthStateChanged } from "firebase/auth";
import AuthContext, { AuthProvider } from "./src/AuthContext";
 
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Tasks') {
            iconName = 'checkmark-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user';
            return <FontAwesome name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
        {({user, loading}) => (

          loading ? (
            <LoadingScreen/>
          ) : (
            <Stack.Navigator>
            {/* If user is connect , then display HomeTabs otherwise AuthStack */}
            {
              user ?
                <React.Fragment>
                  <Stack.Screen name="HomeTasks" component={HomeTabs} options={{ headerShown: false }} />
                  <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
                </React.Fragment>
  
                :
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
  
            }
          </Stack.Navigator>
          )
        )}

        </AuthContext.Consumer>


      </NavigationContainer>
    </AuthProvider>
  );
}



























/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */
