import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  logout,
} from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

const TaskList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Login");
        return;
      }
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle || !newTaskDescription) {
      Alert.alert("Please enter both title and description");
      return;
    }
    setLoading(true);
    try {
      await addTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      loadTasks();
      showMessage({
        message: "Task created successfully",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "Error creating task",
        type: "danger",
      });
      console.error("Error creating task", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      const task = tasks.find((task) => task.id === id);
      if (task) {
        await updateTask(
          id.toString(),
          task.title,
          task.description,
          !completed
        );
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !completed } : task
          )
        );
        showMessage({
          message: "Task updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: "Error updating task",
        type: "danger",
      });
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTask(id);
              setTasks(tasks.filter((task) => task.id !== id));
              showMessage({
                message: "Task deleted successfully",
                type: "success",
              });
            } catch (error) {
              showMessage({
                message: "Error deleting task",
                type: "danger",
              });
              console.error("Error deleting task", error);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("token");
            navigation.navigate("Login");
            showMessage({
              message: "Logged out successfully",
              type: "success",
            });
          } catch (error) {
            showMessage({
              message: "Error logging out",
              type: "danger",
            });
            console.error("Error logging out", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Task Manager</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fdba74" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            placeholderTextColor="#888"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            placeholderTextColor="#888"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTask}
          >
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskContainer}>
                <View style={styles.taskDetails}>
                  <Text
                    style={[
                      styles.taskTitle,
                      item.completed && styles.completed,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.taskDescription}>{item.description}</Text>
                  <Text style={styles.taskTimestamp}>
                    Created at: {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.taskActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleComplete(item.id, item.completed)}
                  >
                    <Text style={styles.actionButtonText}>
                      {item.completed ? "Undo" : "Complete"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#f87171",
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#60a5fa",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  taskDescription: {
    fontSize: 14,
    color: "#555",
  },
  taskTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#a3a3a3",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#60a5fa",
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TaskList;
