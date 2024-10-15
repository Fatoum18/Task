import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { db } from "../config";
import { doc, getDoc } from "firebase/firestore";
import AuthContext from "../AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = doc(db, "Users", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }
    };
    fetchProfile();
  }, [user]);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Name: {profile.name}</Text>
      <Text>Color: {profile.color}</Text>
    </View>
  );
}
