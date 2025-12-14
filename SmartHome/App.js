// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useControl } from './hooks/useControl';

export default function App() {
  const {
    isOn,
    isFanOn,
    temperature,
    humidity,
    isOnline,
    lastUpdated,
    isLoading,
    isRefreshing,
    error,
    toggleLight,
    toggleFan,
    refreshState,
  } = useControl();

  return (
    <View style={[styles.container, isOn ? styles.containerLight : styles.containerDark]}>
      <StatusBar style="auto" />

      <Text style={[styles.title, !isOn && styles.textLight]}>
        Điều khiển bóng đèn ESP32
      </Text>

      {/* Icon bóng đèn */}
      <View style={styles.lightContainer}>
        <Ionicons
          name={isOn ? 'bulb' : 'bulb-outline'}
          size={120}
          color={isOn ? '#FFD700' : '#999'}
        />
      </View>

      {/* Trạng thái đèn */}
      <Text style={[styles.statusText, isOn ? styles.statusOn : styles.textLight]}>
        {isOn ? 'Đèn đang BẬT' : 'Đèn đang TẮT'}
      </Text>

      {/* Nhiệt độ & độ ẩm */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Nhiệt độ: {temperature != null ? `${temperature.toFixed(1)} °C` : '---'}
        </Text>
        <Text style={styles.infoText}>
          Độ ẩm: {humidity != null ? `${humidity}` : '---'}
        </Text>
        <Text style={styles.infoText}>
          Quạt: {isFanOn ? 'BẬT' : 'TẮT'}
        </Text>
        <Text style={[styles.infoText, isOnline ? styles.online : styles.offline]}>
          Trạng thái ESP32: {isOnline ? 'Online' : 'Offline'}
        </Text>
        {lastUpdated && (
          <Text style={styles.infoSubText}>
            Cập nhật lúc: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Nút bật/tắt đèn */}
      <TouchableOpacity
        style={[styles.button, isOn ? styles.buttonOn : styles.buttonOff]}
        onPress={toggleLight}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isOn ? 'TẮT ĐÈN' : 'BẬT ĐÈN'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Nút bật/tắt quạt */}
      <TouchableOpacity
        style={[styles.button, isFanOn ? styles.buttonFanOn : styles.buttonFanOff]}
        onPress={toggleFan}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isFanOn ? 'TẮT QUẠT' : 'BẬT QUẠT'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Nút refresh trạng thái từ ESP32 */}
      <TouchableOpacity onPress={refreshState} style={styles.refreshBtn}>
        {isRefreshing ? (
          <ActivityIndicator color="#90CAF9" />
        ) : (
          <Text style={styles.refreshText}>↻ Làm mới từ ESP32</Text>
        )}
      </TouchableOpacity>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorHint}>
            Kiểm tra lại WiFi, IP ESP32 hoặc xem serial monitor nhé.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerLight: {
    backgroundColor: '#FFF9E6',
  },
  containerDark: {
    backgroundColor: '#2C2C2C',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  lightContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#666',
  },
  textLight: {
    color: '#E0E0E0',
  },
  statusOn: {
    color: '#FFD700',
  },
  infoBox: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  infoText: {
    color: '#ECEFF1',
    fontSize: 14,
  },
  infoSubText: {
    marginTop: 4,
    color: '#B0BEC5',
    fontSize: 12,
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#EF5350',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    minWidth: 220,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonOff: {
    backgroundColor: '#4CAF50',
  },
  buttonOn: {
    backgroundColor: '#F44336',
  },
  buttonFanOff: {
    backgroundColor: '#29B6F6',
  },
  buttonFanOn: {
    backgroundColor: '#1565C0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  refreshBtn: {
    marginTop: 10,
  },
  refreshText: {
    color: '#90CAF9',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  errorHint: {
    color: '#B71C1C',
    fontSize: 12,
  },
});
