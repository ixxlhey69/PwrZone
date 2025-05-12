import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const WarmDownTimerScreen = () => {
  const [minutes, setMinutes] = useState<string>('5');
  const [seconds, setSeconds] = useState<string>('0');
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (isRunning || secondsLeft === 0) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setSecondsLeft((Number(minutes) || 0) * 60 + (Number(seconds) || 0));
  };

  const handleMinutesChange = (text: string) => {
    setMinutes(text.replace(/[^0-9]/g, ''));
  };

  const handleSecondsChange = (text: string) => {
    // Limit seconds to 0-59
    let val = text.replace(/[^0-9]/g, '');
    if (Number(val) > 59) val = '59';
    setSeconds(val);
  };

  const setNewDuration = () => {
    pauseTimer();
    setSecondsLeft((Number(minutes) || 0) * 60 + (Number(seconds) || 0));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Warm Down Timer</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, {width: 60}]}
          value={minutes}
          onChangeText={handleMinutesChange}
          keyboardType="numeric"
          placeholder="Min"
          maxLength={2}
        />
        <Text style={{fontSize: 22, marginHorizontal: 4}}>:</Text>
        <TextInput
          style={[styles.input, {width: 60}]}
          value={seconds}
          onChangeText={handleSecondsChange}
          keyboardType="numeric"
          placeholder="Sec"
          maxLength={2}
        />
        <TouchableOpacity style={styles.setButton} onPress={setNewDuration}>
          <Text style={styles.setButtonText}>Set</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.controlButton} onPress={startTimer}>
          <Text style={styles.controlButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={pauseTimer}>
          <Text style={styles.controlButtonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.instructions}>You can set the timer (in seconds), then start, pause, or reset as needed for your warm down period.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: 100,
    fontSize: 18,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  setButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 15,
    color: '#555',
    marginTop: 18,
    textAlign: 'center',
  },
});

export default WarmDownTimerScreen;
