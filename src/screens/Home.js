import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { db } from '../config';
import { dailyTasks } from '../task-db';
import { collection, doc, setDoc, getDocs, query, where, Timestamp, updateDoc } from 'firebase/firestore';
import AuthContext from '../AuthContext';



export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [availableDailyTasks, setAvailableDailyTasks] = useState([]);
  const [oneTimeTasks, setOneTimeTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const fetchDailyTasks = async () => {
      const today = new Date().toISOString().split('T')[0]; // Format 'yyyy-MM-dd'
      try {
        const tasks = [];
        for (const task of dailyTasks) {
          const completionsQuery = query(
            collection(db, `dailyTasks/${today}/completions`),
            where('taskId', '==', task.id)
          );
          const completionsSnapshot = await getDocs(completionsQuery);
          if (completionsSnapshot.empty) {
            tasks.push(task); // Only include tasks not completed today
          }
        }
        setAvailableDailyTasks(tasks);
      } catch (error) {
        console.error("Error fetching available tasks: ", error);
        setAvailableDailyTasks([]);
      }
    };

    const fetchOneTimeTasks = async () => {
      const q = query(collection(db, `Users/${user.uid}/oneTimeTasks`), where('completed', '==', false));
      const oneTimeTasksSnapshot = await getDocs(q);
      const tasks = oneTimeTasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOneTimeTasks(tasks);
    };

    fetchDailyTasks();
    fetchOneTimeTasks();
  }, [user]);

  const handleCompleteDailyTask = async (taskId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const completionId = `${user.uid}-${taskId}`;
      const completionRef = doc(collection(db, `dailyTasks/${today}/completions`), completionId);

      await setDoc(completionRef, {
        taskId,
        userId: user.uid,
        completedAt: Timestamp.now(),
      });

      setAvailableDailyTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      Alert.alert('Task Completed', 'The daily task has been completed.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCompleteOneTimeTask = async (taskId) => {
    try {
      const taskRef = doc(db, `Users/${user.uid}/oneTimeTasks`, taskId);
      await updateDoc(taskRef, {
        completed: true,
      });

      setOneTimeTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      Alert.alert('Task Completed', 'The one-time task has been completed.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddOneTimeTask = async () => {
    if (!newTaskName.trim()) {
      Alert.alert('Error', 'Task name cannot be empty');
      return;
    }

    try {
      const taskRef = doc(collection(db, `Users/${user.uid}/oneTimeTasks`));
      await setDoc(taskRef, {
        task: newTaskName,
        createdAt: Timestamp.now(),
        completed: false,
        createdBy: user.uid,
      });

      setOneTimeTasks(prevTasks => [...prevTasks, { id: taskRef.id, task: newTaskName, completed: false }]);
      setNewTaskName('');
      setModalVisible(false);
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
          : handleCompleteOneTimeTask(item.id)
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