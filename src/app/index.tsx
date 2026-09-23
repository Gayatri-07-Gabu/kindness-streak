import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
  return new Date().toISOString().split('T')[0];
}

function getLast30Days() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
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
    if (loggedDates.includes(today)) return;

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
  const last30 = getLast30Days();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <Text style={styles.calendarTitle}>Last 30 days</Text>
        <View style={styles.calendarGrid}>
          {last30.map((day) => (
            <View
              key={day}
              style={[
                styles.dayCell,
                loggedDates.includes(day) && styles.dayCellLogged,
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
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
    marginBottom: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#4a3f35',
    fontStyle: 'italic',
    paddingHorizontal: 24,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a3f35',
    marginTop: 24,
    marginBottom: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280,
    gap: 6,
  },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#e8ddd0',
  },
  dayCellLogged: {
    backgroundColor: '#e07a5f',
  },
});