import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WorkoutTrackerScreen = () => {
  const [workoutName, setWorkoutName] = useState<string>('');
  const [sets, setSets] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [weight, setWeight] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const incrementSets = () => setSets(prev => prev + 1);
  const incrementReps = () => setReps(prev => prev + 1);
  const resetCounters = () => {
    setWorkoutName('');
    setSets(0);
    setReps(0);
    setWeight('');
  };

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('workout_history');
      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }
    } catch (e) {
      setHistory([]);
    }
    setLoading(false);
  };

  const saveHistory = async (newHistory: any[]) => {
    try {
      await AsyncStorage.setItem('workout_history', JSON.stringify(newHistory));
    } catch (e) {
      // Handle error
    }
  };

  const completeWorkout = async () => {
    if (workoutName.trim() === '') {
      Alert.alert('Cannot Complete', 'Please enter a workout name.');
      return;
    }
    if (sets === 0 && reps === 0 && weight.trim() === '') {
      Alert.alert('Cannot Complete', 'Please enter sets, reps, or weight before completing a workout.');
      return;
    }
    const newEntry = {
      name: workoutName.trim(),
      date: new Date().toISOString(),
      sets,
      reps,
      weight,
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    await saveHistory(newHistory);
    resetCounters();
    Alert.alert('Workout Saved', 'Your workout has been added to history!');
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyRow}>
      <Text style={styles.historyCell}>{item.name}</Text>
      <Text style={styles.historyCell}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.historyCell}>{item.sets}</Text>
      <Text style={styles.historyCell}>{item.reps}</Text>
      <Text style={styles.historyCell}>{item.weight ? `${item.weight} kg` : ''}</Text>
    </View>
  );

  const deleteHistory = async () => {
    Alert.alert(
      'Delete All Workout History',
      'Are you sure you want to delete all workout history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('workout_history');
          setHistory([]);
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading history...</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderHistoryItem}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Workout Tracker</Text>
              <View style={styles.nameInputContainer}>
                <Text style={styles.nameLabel}>Workout Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={workoutName}
                  onChangeText={setWorkoutName}
                  placeholder="Enter workout name"
                />
              </View>
              <View style={styles.counterContainer}>
                <View style={styles.counter}>
                  <Text style={styles.counterTitle}>Sets</Text>
                  <Text style={styles.counterValue}>{sets}</Text>
                  <TouchableOpacity style={styles.button} onPress={incrementSets}>
                    <Text style={styles.buttonText}>Add Set</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.counter}>
                  <Text style={styles.counterTitle}>Reps</Text>
                  <Text style={styles.counterValue}>{reps}</Text>
                  <TouchableOpacity style={styles.button} onPress={incrementReps}>
                    <Text style={styles.buttonText}>Add Rep</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.weightContainer}>
                <Text style={styles.weightLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.weightInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="Enter weight in kg"
                />
              </View>
              <TouchableOpacity style={styles.completeButton} onPress={completeWorkout}>
                <Text style={styles.completeButtonText}>Complete Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={deleteHistory}>
                <Text style={styles.deleteButtonText}>Delete All History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetButton} onPress={resetCounters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <Text style={styles.historyTitle}>Workout History</Text>
              {history.length === 0 && (
                <Text style={styles.noHistoryText}>No workout history yet.</Text>
              )}
              <View style={styles.historyHeader}>
                <Text style={[styles.historyCell, styles.historyHeaderCell]}>Name</Text>
                <Text style={[styles.historyCell, styles.historyHeaderCell]}>Date</Text>
                <Text style={[styles.historyCell, styles.historyHeaderCell]}>Sets</Text>
                <Text style={[styles.historyCell, styles.historyHeaderCell]}>Reps</Text>
                <Text style={[styles.historyCell, styles.historyHeaderCell]}>Weight</Text>
              </View>
            </>
          }
          ListEmptyComponent={<Text style={styles.noHistoryText}>No workout history yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
  },
  historyTableWrapper: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyHeaderCell: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#222', // merged from duplicate definition
  },
  historyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  historyCell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#f3f3f3',
    fontSize: 14,
    color: '#444',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  counter: {
    alignItems: 'center',
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  weightContainer: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  weightInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  noHistoryText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  nameInputContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});