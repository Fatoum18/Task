 
 const dailyTasks = [
    { id: '1', task: 'Clean classroom 2106' },
    { id: '2', task: 'Clean classroom 2503' },
    { id: '3', task: 'Refill paper in teachers’ room printer' },
    { id: '4', task: 'Empty trash can in room 2103' },
  ];
  
 function getTaskById(id) {
    const taskObj = dailyTasks.find(task => task.id === id);
    return taskObj ? taskObj.task : "No Task associated";
  }

  export {dailyTasks,getTaskById}