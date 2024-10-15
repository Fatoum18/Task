import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { db } from "../config";
import { doc, updateDoc } from "firebase/firestore";

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;

  const handleMarkAsDone = async () => {
    const taskRef = doc(db, task.type === "DailyTasks" ? "DailyTasks" : "OneTimeTasks", task.id);
    await updateDoc(taskRef, { isCompleted: true });
    navigation.goBack();
  };

  return (
    <View>
      <Text>Task: {task.title}</Text>
      <Text>Status: {task.isCompleted ? "Completed" : "Pending"}</Text>
      {!task.isCompleted && <Button title="Mark as Done" onPress={handleMarkAsDone} />}
    </View>
  );
}