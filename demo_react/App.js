import React, { useState, useMemo } from 'react';
import { TextInput, Button, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const initialTasks = [
  {
    id: '1',
    dateLabel: 'Hôm nay',
    time: '16:50',
    title: 'Tổng kết dự án',
    subtasks: [],
  },
  {
    id: '2',
    dateLabel: 'Hôm nay',
    time: '16:50',
    title: 'Họp nhóm buổi tối',
    subtasks: [],
  },
  {
    id: '3',
    dateLabel: 'Hôm nay',
    time: null,
    title: 'Chuẩn bị báo cáo tháng',
    subtasks: [],
  },
];

// Icons cho các thống kê
const statIcons = {
  today: '📅',
  completed: '✅',
  all: '📋',
  overdue: '⏰',
};

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [sound, setSound] = useState();

  // Tính toán số liệu thống kê từ danh sách tasks
  const stats = useMemo(() => {
    const todayCount = tasks.filter(t => t.dateLabel === 'Hôm nay').length;
    const completedCount = completedTasks.length;
    const allCount = tasks.length;
    const overdueCount = tasks.filter(t => t.overdue).length;
    return [
      { id: 'today', label: 'Hôm nay', value: todayCount, color: '#C8D7FF' },
      { id: 'completed', label: 'Hoàn thành', value: completedCount, color: '#FFE99C' },
      { id: 'all', label: 'Tất cả', value: allCount, color: '#DDF7EE' },
      { id: 'overdue', label: 'Quá hạn', value: overdueCount, color: '#FFD4EC' },
    ];
  }, [tasks, completedTasks]);

  // Phát âm thanh khi hoàn thành
  const playCompletionSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        // Sử dụng âm thanh mặc định của hệ thống
        require('./assets/complete.wav'),
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Không thể phát âm thanh:', error);
    }
  };

  // Dọn dẹp âm thanh khi component unmount
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleCheckTask = async (id) => {
    const wasCompleted = completedTasks.includes(id);
    
    setCompletedTasks((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );

    // Phát âm thanh khi đánh dấu hoàn thành (không phát khi bỏ tick)
    if (!wasCompleted) {
      await playCompletionSound();
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: (tasks.length + 1).toString(),
      dateLabel: 'Hôm nay',
      time: newTaskTime.trim() || null,
      title: newTaskTitle,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskTime('');
  };

  const renderStat = ({ item }) => (
    <View style={[styles.statCard, { backgroundColor: item.color }]}> 
      <View style={styles.statCircleWrapper}>
        <View style={styles.statCircle}>
          <Text style={styles.statIcon}>{statIcons[item.id]}</Text>
        </View>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Text style={styles.statValue}>{item.value}</Text>
      </View>
    </View>
  );

  const renderTask = ({ item }) => {
    const isCompleted = completedTasks.includes(item.id);
    return (
      <View style={[styles.taskCard, isCompleted && styles.taskCardCompleted]}>
        <TouchableOpacity style={styles.taskLeft} onPress={() => handleCheckTask(item.id)}>
          <View style={[styles.checkCircle, isCompleted && styles.checkCircleCompleted]}>
            {isCompleted ? (
              <Text style={styles.checkMark}>✓</Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <View style={styles.taskBody}>
          <View style={styles.taskMeta}>
            <Text style={styles.metaText}>{item.dateLabel}</Text>
            {item.time ? <Text style={styles.metaText}>  ⏱ {item.time}</Text> : null}
          </View>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>{item.title}</Text>
          {item.subtasks && item.subtasks.length > 0 && (
            <View style={styles.subtasks}>
              {item.subtasks.map((s, i) => (
                <Text key={i} style={styles.subtaskText}>⬜ {s}</Text>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreDots}>⋯</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào Duy,</Text>
            <Text style={styles.subtitle}>Bạn có công việc hôm nay</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <FlatList
            data={stats}
            renderItem={renderStat}
            keyExtractor={(i) => i.id}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>

        {/* Ô nhập công việc mới */}
        <View style={styles.addTaskSection}>
          <TextInput
            style={styles.input}
            placeholder="Nhập công việc mới..."
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <TextInput
            style={styles.inputTime}
            placeholder="Thời hạn (VD: 16:50)"
            value={newTaskTime}
            onChangeText={setNewTaskTime}
          />
          <Button title="Thêm" onPress={handleAddTask} />
        </View>

        <Text style={styles.sectionTitle}>Công việc hôm nay</Text>

        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  addTaskSection: {
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  inputTime: {
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    paddingTop: 40,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  statsGrid: {
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  statCircleWrapper: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  statCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },
  statLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#E0E7FF',
  },
  taskLeft: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#93C5FD',
    borderColor: '#2563EB',
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: -2,
  },
  taskBody: {
    flex: 1,
    paddingHorizontal: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#6B7280',
    fontSize: 12,
  },
  taskTitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  subtasks: {
    marginTop: 6,
  },
  subtaskText: {
    color: '#6B7280',
    fontSize: 13,
  },
  moreButton: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreDots: {
    color: '#9CA3AF',
    fontSize: 20,
  },
});