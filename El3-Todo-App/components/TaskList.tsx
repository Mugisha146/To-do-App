import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchTasks, addTask, updateTask, deleteTask, logout } from "../services/api";
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

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
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
    }
  };

  const handleCreateTask = async () => {
    try {
      await addTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      loadTasks();
    } catch (error) {
      console.error("Error creating task", error);
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
      }
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          placeholderTextColor="#F0F8FF"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Task Description"
          placeholderTextColor="#F0F8FF"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
        />
        <View style={styles.NewTasks}>
          <Button
            title="Create Task"
            color="#fdba74"
            onPress={handleCreateTask}
          />
        </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View>
              <Text
                style={[styles.taskText, item.completed && styles.completed]}
              >
                {item.title}
              </Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
              <Text style={styles.timeText}>
                Created at: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleComplete(item.id, item.completed)}
            >
              <Text style={styles.button}>
                {item.completed ? "Undo" : "Complete"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.button}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.logout}>
        <Button title="Logout" color="#fdba74"  onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fdba74",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop:10,
  },
  descriptionText: {
    fontSize: 14,
    color: "gray",
  },
  timeText: {
    fontSize: 12,
    color: "#F0F8FF",
  },
  completed: {
    textDecorationLine: "line-through",
  },
  button: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F0F8FF",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: "#F0F8FF",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  NewTasks: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  logout: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    padding: 10,
  },
});

export default TaskList;
