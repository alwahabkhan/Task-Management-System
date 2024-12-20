import React, { useState, useEffect } from 'react';
import Parse from '../parseConfig.js';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';



const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const query = new Parse.Query('Tasks');
        const results = await query.find();
        setTasks(results.map((task) => ({
          id: task.id,
          ...task.attributes,
        })));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    let subscription = null;
    const query = new Parse.Query('Tasks');

    query.subscribe()
      .then((sub) => {
        subscription = sub;
        sub.on('create', fetchTasks);
        sub.on('update', fetchTasks);
        sub.on('delete', fetchTasks);
      })
      .catch((error) => console.error('Error subscribing to Live Query:', error));

    return () => {
      if (subscription) {
        subscription.unsubscribe().catch((error) =>
          console.error('Error unsubscribing:', error)
        );
      }
    };
  }, []);

  const handleAddTask = async () => {
    try {
      const newTaskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        status: 'pending',
      };

      const result = await Parse.Cloud.run('createTask', newTaskData);
      console.log('Task created:', result);
      setNewTask({ title: '', description: '', dueDate: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };


  const handleUpdateTask = async (id, status) => {
    try {
      const updateData = {
        taskId: id,
        status: status,
      };

      const result = await Parse.Cloud.run('updateTask', updateData);
      console.log('Task updated:', result);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const handleDeleteTask = async (id) => {
    try {
      const result = await Parse.Cloud.run('deleteTask', { taskId: id });
      console.log('Task deleted:', result);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        Task Management System
      </Typography>

      <Box
        component="form"
        sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" gutterBottom>
          Add New Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddTask}>
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Box>


      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography variant="body2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Status: {task.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleUpdateTask(task.id, 'completed')}
                >
                  Mark as Completed
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
