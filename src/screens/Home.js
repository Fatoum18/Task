import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const Home = () => {
  const dailyTasks = [
    { id: '1', task: 'Clean classroom 2106' },
    { id: '2', task: 'Clean classroom 2503' },
    { id: '3', task: 'Refill paper in teachers’ room printer' },
    { id: '4', task: 'Empty trash can in room 2103' },
  ];

  const oneTimeTasks = [
    { id: '1', task: 'Open classroom 2106 at 8:00 AM on 26/12/2024' },
  ];

  const [completedTasks, setCompletedTasks] = useState([]);

  const markTaskComplete = (taskId) => {
    setCompletedTasks([...completedTasks, taskId]);
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Daily Tasks:</Text>
      <FlatList
        data={dailyTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.task}</Text>
            {!completedTasks.includes(item.id) && (
              <Button title="Mark as Done" onPress={() => markTaskComplete(item.id)} />
            )}
          </View>
        )}
      />

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>One-Time Tasks:</Text>
      <FlatList
        data={oneTimeTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.task}</Text>
            {!completedTasks.includes(item.id) && (
              <Button title="Mark as Done" onPress={() => markTaskComplete(item.id)} />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default Home;
