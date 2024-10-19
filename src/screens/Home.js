import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { db } from '../config';
import { collection, doc, setDoc, getDocs, query, where, Timestamp, updateDoc } from 'firebase/firestore';
import AuthContext from '../AuthContext';

// Hardcoded daily tasks
const dailyTasks = [
  { id: '1', task: 'Clean classroom 2106' },
  { id: '2', task: 'Clean classroom 2503' },
  { id: '3', task: 'Refill paper in teachers’ room printer' },
  { id: '4', task: 'Empty trash can in room 2103' },
];

export default function HomePage() {
  const { user } = useContext(AuthContext); // Get user info from AuthContext
  const [availableDailyTasks, setAvailableDailyTasks] = useState([]); // Daily tasks that are not yet completed today
  const [oneTimeTasks, setOneTimeTasks] = useState([]); // One-time tasks created by the user
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [newTaskName, setNewTaskName] = useState(''); // Input state for new task name

  useEffect(() => {
    // Fetch available daily tasks (those not completed today)
    const fetchDailyTasks = async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const q = query(collection(db, 'dailyTasks'), where('completedAt', '>=', Timestamp.fromDate(startOfDay)));

      const completedTasksSnapshot = await getDocs(q);
      const completedTaskIds = completedTasksSnapshot.docs.map(doc => doc.id);

      const filteredTasks = dailyTasks.filter(task => !completedTaskIds.includes(task.id));
      setAvailableDailyTasks(filteredTasks); // Show tasks that are not yet completed today
    };

    // Fetch one-time tasks specific to the user
    const fetchOneTimeTasks = async () => {
      const q = query(collection(db, `users/${user.uid}/oneTimeTasks`), where('completed', '==', false));
      const oneTimeTasksSnapshot = await getDocs(q);
      const tasks = oneTimeTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOneTimeTasks(tasks); // Set one-time tasks for the user
    };

    fetchDailyTasks();
    fetchOneTimeTasks();
  }, [user]);

  // Mark a daily task as completed
  const handleCompleteDailyTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'dailyTasks', taskId);
      await setDoc(taskRef, {
        completedBy: user.uid,
        completedAt: Timestamp.now(),
      });

      // Remove task from the list of available daily tasks
      setAvailableDailyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      Alert.alert('Task Completed', 'The daily task has been completed.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Mark a one-time task as completed (only if the current user created it)
  const handleCompleteOneTimeTask = async (taskId) => {
    try {
      const taskRef = doc(db, `users/${user.uid}/oneTimeTasks`, taskId);
      await updateDoc(taskRef, {
        completed: true,
      });

      // Remove task from the list of one-time tasks
      setOneTimeTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      Alert.alert('Task Completed', 'The one-time task has been completed.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Add one-time task to Firestore
  const handleAddOneTimeTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Task name cannot be empty');
      return;
    }

    try {
      const taskRef = doc(collection(db, `users/${user.uid}/oneTimeTasks`));
      await setDoc(taskRef, {
        task: newTaskName,
        createdAt: Timestamp.now(),
        completed: false, // Mark as not completed initially
        createdBy: user.uid, // Store who created the task
      });

      // Update one-time tasks locally
      setOneTimeTasks(prevTasks => [...prevTasks, { id: taskRef.id, task: newTaskName, completed: false }]);
      setNewTaskName(''); // Clear the input
      setModalVisible(false); // Close the modal
      Alert.alert('Task Added', 'The one-time task has been added.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderTask = ({ item, isDaily }) => (
    <TouchableOpacity
      style={styles.task}
      onPress={() =>
        isDaily
          ? handleCompleteDailyTask(item.id)
          : handleCompleteOneTimeTask(item.id) // Allow completion only for one-time tasks created by the user
      }
    >
      <Text>{item.task}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Tasks</Text>
      <FlatList
        data={availableDailyTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTask({ item, isDaily: true })}
      />

      <Text style={styles.title}>One-Time Tasks</Text>
      <FlatList
        data={oneTimeTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTask({ item, isDaily: false })}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add One-Time Task</Text>
      </TouchableOpacity>

      {/* Modal for adding a new one-time task */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter One-Time Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <Button title="Add Task" onPress={handleAddOneTimeTask} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  task: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
});