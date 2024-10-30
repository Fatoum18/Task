import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { getTaskById } from '../task-db';
import { collection, query, where, getDocs, Timestamp, doc, getDoc , onSnapshot} from 'firebase/firestore';

export default function CompletedTasksScreen({ navigation }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    const completionsRef = collection(db, `dailyTasks/${today}/completions`);

    // Set up real-time listener for completed tasks
    const unsubscribe = onSnapshot(completionsRef, async (snapshot) => {
      const tasks = await Promise.all(
        snapshot.docs.map(async (completionDoc) => {
          const completionData = completionDoc.data();
          const userRef = doc(db, 'Users', completionData.userId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            return {
              id: completionDoc.id,
              task: getTaskById(completionData.taskId),
              completedBy: userData.name || 'Unknown User',
              profileColor: userData.color || '#D3D3D3', // Default color if none set
              completedAt: completionData.completedAt.toDate(),
            };
          }
          return null;
        })
      );

      setCompletedTasks(tasks.filter((task) => task !== null));
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const renderTask = ({ item }) => (
    <View style={[styles.taskContainer, { backgroundColor: item.profileColor }]}>
      <Text style={styles.taskText}>{item.task}</Text>
      <Text style={styles.taskText}>Completed by: {item.completedBy}</Text>
      <Text style={styles.taskText}>Completed at: {item.completedAt.toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskContainer: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  taskText: {
    color: '#fff',
    fontSize: 16,
  },
});