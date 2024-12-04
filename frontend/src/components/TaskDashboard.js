import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  deleteTask,
  createTask,
  fetchLogs,
} from "../api/taskApi";
import Modal from "react-modal";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [newTask, setNewTask] = useState({
    displayName: "",
    schedule: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    loadTasks();
  }, []);

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
  const openLogsModal = async (taskId) => {
    try {
      const logsData = await fetchLogs(taskId);
      setLogs(logsData);
      setIsLogsModalOpen(true);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const closeLogsModal = () => {
    setIsLogsModalOpen(false);
    setLogs([]);
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  

  const handleRefresh = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = await createTask(newTask);
      setTasks([...tasks, taskData]);
      setNewTask({ displayName: "", schedule: "", email: "", message: "" });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mb-4">Task Dashboard</h2>

      <button
        onClick={handleRefresh}
        className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-md"
      >
        Refresh Tasks
      </button>

      <button
        onClick={() => setIsFormOpen(true)}
        className="mb-4 ml-2 py-2 px-4 bg-green-600 text-white rounded-md"
      >
        Add New Task
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Task Name</th>
              <th className="px-4 py-2 border">Schedule</th>
              <th className="px-4 py-2 border">Success Count</th>
              <th className="px-4 py-2 border">Error Count</th>
              <th className="px-4 py-2 border">Last Success</th>
              <th className="px-4 py-2 border">Last Error</th>
              <th className="px-4 py-2 border">Disabled</th>
              <th className="px-4 py-2 border">Retries</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{task.displayName}</td>
                <td className="px-4 py-2 border">{task.schedule}</td>
                <td className="px-4 py-2 border">{task.successCount}</td>
                <td className="px-4 py-2 border">{task.errorCount}</td>
                <td className="px-4 py-2 border">
                  {task.lastSuccess
                    ? new Date(task.lastSuccess).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border">{task.lastError || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {task.disabled ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2 border">{task.retries}</td>
                <td className="px-4 py-2 border">{task.status}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => openModal(task)}
                    className="mr-2 text-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="mr-2 text-red-600"
                  >
                    Delete
                  </button>
                 
                  <button
                    onClick={() => openLogsModal(task._id)}
                    className="ml-2 text-blue-600"
                  >
                    View Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="font-bold text-xl mb-4">
            {selectedTask?.displayName}
          </h2>
          <p>
            <strong>Schedule:</strong> {selectedTask?.schedule}
          </p>
          <p>
            <strong>Success Count:</strong> {selectedTask?.successCount}
          </p>
          <p>
            <strong>Error Count:</strong> {selectedTask?.errorCount}
          </p>
          <p>
            <strong>Last Success:</strong>{" "}
            {selectedTask?.lastSuccess
              ? new Date(selectedTask.lastSuccess).toLocaleString()
              : "N/A"}
          </p>
          <p>
            <strong>Last Error:</strong> {selectedTask?.lastError || "N/A"}
          </p>
          <p>
            <strong>Disabled:</strong> {selectedTask?.disabled ? "Yes" : "No"}
          </p>
          <p>
            <strong>Retries:</strong> {selectedTask?.retries}
          </p>
          <p>
            <strong>Status:</strong> {selectedTask?.status}
          </p>
          <button onClick={closeModal} className="mt-4 text-blue-600">
            Close
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isLogsModalOpen}
        onRequestClose={closeLogsModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="font-bold text-xl mb-4">Task Logs</h2>
          <ul className="space-y-2">
            {logs.length === 0 ? (
              <li>No logs available</li>
            ) : (
              logs.map((log, index) => (
                <li key={index}>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Message:</strong> {log.message}
                  </p>
                  <p>
                    <strong>Status:</strong> {log.status}
                  </p>
                  <hr />
                </li>
              ))
            )}
          </ul>
          <button onClick={closeLogsModal} className="mt-4 text-blue-600">
            Close
          </button>
        </div>
      </Modal>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="font-bold text-xl mb-4">Create New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                name="displayName"
                value={newTask.displayName}
                onChange={handleInputChange}
                placeholder="Task Name"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <input
                type="text"
                name="schedule"
                value={newTask.schedule}
                onChange={handleInputChange}
                placeholder="Schedule (Cron Expression)"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <input
                type="email"
                name="email"
                value={newTask.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <textarea
                name="message"
                value={newTask.message}
                onChange={handleInputChange}
                placeholder="Message"
                className="p-2 border border-gray-300 rounded-md w-full"
                required
              />
              <button
                type="submit"
                className="py-2 px-4 bg-green-600 text-white rounded-md"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="py-2 px-4 bg-gray-600 text-white rounded-md ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
