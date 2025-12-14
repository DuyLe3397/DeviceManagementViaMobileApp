// hooks/useLightControl.js
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// ⚠️ ĐỔI IP NÀY THÀNH IP THẬT CỦA ESP32 TRÊN MẠNG NHÀ BẠN
// Ví dụ: 'http://192.168.1.50'
// hooks/useLightControl.js
const ESP32_BASE_URL = 'http://192.168.1.3';  


const ESP32_API = {
  STATUS: `${ESP32_BASE_URL}/data_from_esp32`, // GET
  LED: `${ESP32_BASE_URL}/led`,               // POST
  FAN: `${ESP32_BASE_URL}/fan`,               // POST
  PING: `${ESP32_BASE_URL}/is_online`,        // GET
};


/**
 * Custom hook để điều khiển LED & đọc trạng thái từ ESP32
 */
export const useLightControl = () => {
  const [isOn, setIsOn] = useState(false);        // trạng thái đèn
  const [isFanOn, setIsFanOn] = useState(false);  // trạng thái quạt (nếu dùng)
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const [isLoading, setIsLoading] = useState(false);      // loading cho thao tác chính
  const [isRefreshing, setIsRefreshing] = useState(false); // loading riêng cho refresh
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ====== Lấy dữ liệu tổng từ /data_from_esp32 ======
  const refreshState = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      console.log('GET:', ESP32_API.STATUS);
      const res = await axios.get(ESP32_API.STATUS);

      console.log('STATUS response:', res.status, res.data);

      if (res.status === 200 && res.data?.success) {
        const data = res.data;

        setIsOn(data.status_led === 'ON');
        setIsFanOn(data.status_fan === 'ON');
        setTemperature(typeof data.temperature === 'number'
          ? data.temperature
          : parseFloat(data.temperature)
        );

        // humidity có thể là chuỗi (có mã hóa); ta cứ lưu để UI hiển thị
        setHumidity(data.humidity);
        setIsOnline(!!data.is_online);
        setLastUpdated(new Date());
      } else {
        setError('Không đọc được dữ liệu từ ESP32');
      }
    } catch (err) {
      console.log(
        'Error fetching light state:',
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      setError(err.message || 'Không thể kết nối với ESP32');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ====== Bật / tắt đèn: POST /led với { status_led } ======
  // Bật/tắt đèn
const toggleLight = useCallback(async () => {
  setIsLoading(true);
  setError(null);

  const newState = !isOn;
  const payload = { status_led: newState ? 'ON' : 'OFF' };

  try {
    const res = await axios.post(ESP32_API.LED, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 200 && res.data?.success) {
      setIsOn(res.data.status_led === 'ON');
      setLastUpdated(new Date());
    } else {
      setError('Không thể thay đổi trạng thái đèn');
    }
  } catch (err) {
    setError(err.message || 'Không thể kết nối với ESP32');
  } finally {
    setIsLoading(false);
  }
}, [isOn]);


  // ====== (Optional) Bật / tắt quạt: POST /fan ======
  const toggleFan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const newState = !isFanOn;
    const payload = { status_fan: newState ? 'ON' : 'OFF' };

    try {
      console.log('POST:', ESP32_API.FAN, payload);
      const res = await axios.post(ESP32_API.FAN, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('FAN response:', res.status, res.data);

      if (res.status === 200 && res.data?.success) {
        setIsFanOn(res.data.status_fan === 'ON');
        setLastUpdated(new Date());
      } else {
        setError('Không thể thay đổi trạng thái quạt');
      }
    } catch (err) {
      console.log(
        'Error toggling fan:',
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      setError(err.message || 'Không thể kết nối với ESP32');
    } finally {
      setIsLoading(false);
    }
  }, [isFanOn]);

  // ====== Ping đơn giản /is_online (nếu cần) ======
  const checkOnline = useCallback(async () => {
    try {
      const res = await axios.get(ESP32_API.PING);
      setIsOnline(res.status === 200 && res.data?.online);
    } catch {
      setIsOnline(false);
    }
  }, []);

  // Lấy trạng thái ban đầu khi app khởi động
  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return {
    // trạng thái thiết bị
    isOn,
    isFanOn,
    temperature,
    humidity,
    isOnline,
    lastUpdated,

    // trạng thái UI
    isLoading,
    isRefreshing,
    error,

    // hành động
    toggleLight,
    toggleFan,
    refreshState,
    checkOnline,
  };
};
