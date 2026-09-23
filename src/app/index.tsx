import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KINDNESS_IDEAS = [
  'Send someone a genuine compliment',
  'Let someone go ahead of you in line',
  'Check in on a friend you haven\'t talked to in a while',
  'Leave a kind review for a local business',
  'Hold the door for someone',
  'Say thank you to someone who helped you recently',
  'Pick up litter you see on your walk',
  'Share something helpful with a coworker or classmate',
];

const STORAGE_KEY = 'kindness_logs';

function getTodayString() {
  return new Date().toISOString().split('T')[0]; // e.g. "2026-09-23"
}

export default function HomeScreen() {
  const [loggedDates, setLoggedDates] = useState<string[]>([]);
  const [idea, setIdea] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLoggedDates(JSON.parse(saved));
    }
  }

  async function logTodayKindness() {
    const today = getTodayString();
    if (loggedDates.includes(today)) return; // already logged today

    const updated = [...loggedDates, today];
    setLoggedDates(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function showRandomIdea() {
    const random = KINDNESS_IDEAS[Math.floor(Math.random() * KINDNESS_IDEAS.length)];
    setIdea(random);
  }

  const doneToday = loggedDates.includes(getTodayString());
  const streak = loggedDates.length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kindness Streak</Text>

      <View style={styles.streakBox}>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.streakLabel}>day{streak === 1 ? '' : 's'} of kindness</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, doneToday && styles.buttonDone]}
        onPress={logTodayKindness}
        disabled={doneToday}
      >
        <Text style={styles.buttonText}>
          {doneToday ? '✓ Logged for today' : 'I did a kind thing today'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ideaButton} onPress={showRandomIdea}>
        <Text style={styles.ideaButtonText}>Need an idea?</Text>
      </TouchableOpacity>

      {idea ? <Text style={styles.ideaText}>{idea}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#4a3f35',
  },
  streakBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#e07a5f',
  },
  streakLabel: {
    fontSize: 16,
    color: '#6b5b4d',
  },
  button: {
    backgroundColor: '#e07a5f',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonDone: {
    backgroundColor: '#a8a29e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ideaButton: {
    padding: 12,
  },
  ideaButtonText: {
    color: '#6b5b4d',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  ideaText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#4a3f35',
    fontStyle: 'italic',
    paddingHorizontal: 24,
  },
});