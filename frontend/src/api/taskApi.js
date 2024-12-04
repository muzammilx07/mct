import axios from 'axios';

const API_URL = 'http://localhost:8080/tasks';

export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLogs = async (taskId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/logs/task/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};