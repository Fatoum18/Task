// TasksScreen.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "../config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {AuthContext} from "../../App";

export default function TasksScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [oneTimeTasks, setOneTimeTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const dailyTasksSnapshot = await getDocs(collection(db, "DailyTasks"));
      setDailyTasks(dailyTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const oneTimeTasksSnapshot = await getDocs(collection(db, "OneTimeTasks"));
      setOneTimeTasks(oneTimeTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, []);

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("TaskDetail", { task: item })}>
      <Text style={{ textDecorationLine: item.isCompleted ? "line-through" : "none" }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text>Daily Tasks</Text>
      <FlatList data={dailyTasks} renderItem={renderTask} keyExtractor={(item) => item.id} />
      <Text>One-Time Tasks</Text>
      <FlatList data={oneTimeTasks} renderItem={renderTask} keyExtractor={(item) => item.id} />
    </View>
  );
}
