import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

const STORAGE_KEY = 'calorie_intake_history';

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const getNowTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

// New data model: { date: string, entries: { time: string, calories: number }[] }

type CalorieEntry = { time: string, calories: number, label: string };
type CalorieDay = { date: string, entries: CalorieEntry[] };

const CalorieCountScreen = () => {
  const [input, setInput] = useState('');
  const [label, setLabel] = useState('');
  const [history, setHistory] = useState<CalorieDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        let parsed = JSON.parse(data);
        // Migrate old data if necessary
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].calories !== undefined) {
          // Old format: [{date, calories}]
          parsed = parsed.map((item: any) => ({
            date: item.date,
            entries: [{ time: 'Unknown', calories: item.calories, label: '' }]
          }));
        }
        // Ensure all entries arrays are defined and have label
        parsed = parsed.map((item: any) => ({
          ...item,
          entries: Array.isArray(item.entries)
            ? item.entries.map((entry: any) => ({
                ...entry,
                label: typeof entry.label === 'string' ? entry.label : ''
              }))
            : []
        }));
        setHistory(parsed);
      }
    } catch {}
    setLoading(false);
  };

  const saveHistory = async (newHistory: CalorieDay[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {}
  };

  const addCalories = async () => {
    const val = parseInt(input);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid input', 'Please enter a positive calorie number.');
      return;
    }
    const today = getToday();
    const nowTime = getNowTime();
    let found = false;
    const newEntry = { time: nowTime, calories: val, label: label.trim() };
    const newHistory = history.map(day => {
      if (day.date === today) {
        found = true;
        return { ...day, entries: [newEntry, ...day.entries] };
      }
      return day;
    });
    if (!found) {
      newHistory.push({ date: today, entries: [newEntry] });
    }
    newHistory.sort((a, b) => b.date.localeCompare(a.date));
    setHistory(newHistory);
    await saveHistory(newHistory);
    setInput('');
    setLabel('');
  };

  // Data for the graph
  const last7Days = getLast7Days();
  const graphData = last7Days.map(date => {
    const entry = history.find(e => e.date === date);
    if (!entry) return 0;
    return entry.entries.reduce((sum, e) => sum + e.calories, 0);
  });

  const deleteHistory = async () => {
    Alert.alert(
      'Delete All History',
      'Are you sure you want to delete all calorie history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setHistory([]);
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Intake Tracker</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter calories"
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Label (e.g. Breakfast, Snack)"
          value={label}
          onChangeText={setLabel}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCalories}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteHistory}>
        <Text style={styles.deleteButtonText}>Delete All History</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Past 7 Days</Text>
      <LineChart
        data={{
          labels: last7Days.map(d => d.slice(5)),
          datasets: [{ data: graphData }],
        }}
        width={Dimensions.get('window').width - 32}
        height={220}
        yAxisSuffix=" cal"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
        bezier
      />
      <Text style={styles.subtitle}>Calorie Log</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={history.sort((a, b) => b.date.localeCompare(a.date))}
          keyExtractor={item => item.date}
          renderItem={({ item }) => (
            <View style={styles.daySection}>
              <Text style={styles.dayHeader}>
                {item.date} (Total: {(Array.isArray(item.entries) ? item.entries : []).reduce((sum, e) => sum + e.calories, 0)} cal)
              </Text>
              {item.entries.length === 0 ? (
                <Text style={styles.noData}>No entries for this day.</Text>
              ) : (
                item.entries.map((entry, idx) => (
                  <View key={idx} style={styles.entryRow}>
                    <Text style={styles.entryTime}>{entry.time}</Text>
                    <Text style={styles.entryLabel}>{entry.label ? entry.label : ''}</Text>
                    <Text style={styles.entryCalories}>{entry.calories} cal</Text>
                  </View>
                ))
              )}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noData}>No calorie data yet.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 18, alignSelf: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  addButton: { marginLeft: 10, backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, color: '#222' },
  daySection: { marginBottom: 18, backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 1 },
  dayHeader: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#eee' },
  entryTime: { fontSize: 15, color: '#333', flex: 1 },
  entryLabel: { fontSize: 15, color: '#777', flex: 2, paddingLeft: 10 },
  entryCalories: { fontSize: 15, color: '#2196F3', fontWeight: 'bold', flex: 1, textAlign: 'right' },
  noData: { color: '#888', textAlign: 'center', marginTop: 20 },
  deleteButton: { backgroundColor: '#e53935', padding: 10, borderRadius: 8, marginBottom: 10, alignSelf: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CalorieCountScreen;
