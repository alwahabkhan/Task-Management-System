Parse.Cloud.define('hello', (req) => {
  req.log.info(req);
  return 'Hi';
});

Parse.Cloud.define('asyncFunction', async (req) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  req.log.info(req);
  return 'Hi async';
});

Parse.Cloud.beforeSave('Test', () => {
  throw new Parse.Error(9001, 'Saving test objects is not available.');
});

Parse.Cloud.define('createTask', async (request) => {
  const { title, description, status, dueDate } = request.params;

  const Task = Parse.Object.extend('Tasks');
  const task = new Task();

  task.set('title', title);
  task.set('description', description);
  task.set('status', status);
  task.set('dueDate', dueDate);

  try {
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new Error('Invalid date format');
    }
    task.set('dueDate', parsedDueDate);
  } catch (error) {
    throw new Parse.Error(100, 'Invalid due date: ' + error.message);
  }

  try {
    const savedTask = await task.save();
    return savedTask;
  } catch (error) {
    throw new Parse.Error(100, 'Error creating task: ' + error.message);
  }
});


Parse.Cloud.define('updateTask', async (request) => {
  const { taskId, title, description, status, dueDate } = request.params;

  const Task = Parse.Object.extend('Tasks');
  const query = new Parse.Query(Task);

  try {
    const task = await query.get(taskId);
    task.set('title', title);
    task.set('description', description);
    task.set('status', status);
    task.set('dueDate', dueDate);

    const updatedTask = await task.save();
    return updatedTask;
  } catch (error) {
    throw new Parse.Error(100, 'Error updating task: ' + error.message);
  }
});


Parse.Cloud.define('deleteTask', async (request) => {
  const { taskId } = request.params;

  const Task = Parse.Object.extend('Tasks');
  const query = new Parse.Query(Task);

  try {
    const task = await query.get(taskId);
    await task.destroy();

    return { success: true };
  } catch (error) {
    throw new Parse.Error(100, 'Error deleting task: ' + error.message);
  }
});



