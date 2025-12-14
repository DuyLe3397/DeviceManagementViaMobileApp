# SmartLight - Ứng dụng Điều khiển Đèn Thông minh

Ứng dụng React Native để điều khiển đèn LED thông qua ESP32

## 📋 Yêu cầu hệ thống

- **Node.js** (phiên bản 16 trở lên)
- **npm** hoặc **yarn**
- **Expo CLI**

## 🚀 Cài đặt

### 1. Cài đặt Node.js
Tải và cài đặt từ [nodejs.org](https://nodejs.org/)

### 2. Cài đặt Expo CLI (nếu chưa có)
```bash
npm install -g expo-cli
```

### 3. Cài đặt dependencies
Di chuyển vào thư mục project và chạy:
```bash
cd smartlight
npm install
```

Hoặc nếu dùng yarn:
```bash
yarn install
```

## 📦 Các thư viện chính

- **expo** (~54.0.27) - Framework React Native
- **react** (19.1.0) - Core React
- **react-native** (0.81.5) - Core React Native
- **axios** (^1.13.2) - HTTP client để gọi API
- **@expo/vector-icons** (^15.0.3) - Icons library
- **expo-status-bar** (~3.0.9) - Status bar component
- **react-native-web** (~0.21.0) - Hỗ trợ chạy trên web

## ▶️ Chạy ứng dụng

### Chạy development server
```bash
npm start 
```
hoặc 
```bash
npx expo start --web --port 3001
```
### Chạy trên các nền tảng cụ thể
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🔧 Cấu hình

API endpoint được cấu hình trong `hooks/useLightControl.js`:
```javascript
const ESP32_API_URL = 'https://api.helpass.io.vn';
```

## 📱 Tính năng

- ✅ Bật/tắt đèn LED thông qua ESP32
- ✅ Hiển thị trạng thái đèn real-time
- ✅ Hiệu ứng thay đổi nền theo trạng thái đèn
- ✅ Icon đèn động
- ✅ Xử lý lỗi kết nối

## 🧩 Tóm tắt các chức năng chính của hook:

- Lấy trạng thái thiết bị: Hàm refreshState() sẽ gửi một yêu cầu GET đến ESP32 để lấy trạng thái hiện tại của đèn LED, quạt, nhiệt độ, độ ẩm và tình trạng kết nối. Các trạng thái này được lưu vào state của hook.

- Bật/tắt đèn: Hàm toggleLight() sẽ gửi một yêu cầu POST đến ESP32 để bật hoặc tắt đèn LED.

- Bật/tắt quạt: Hàm toggleFan() sẽ gửi một yêu cầu POST đến ESP32 để bật hoặc tắt quạt.

- Kiểm tra trạng thái kết nối: Hàm checkOnline() sẽ gửi một yêu cầu GET đến ESP32 để kiểm tra xem thiết bị có kết nối không.

Trước khi sử dụng, cần phải cập nhật địa chỉ IP của thiết bị ESP32 trong biến ESP32_BASE_URL.

- Để sử dụng hook này, có thể import và gọi nó trong một component:
```bash
import { useLightControl } from './hooks/useLightControl';

const MyComponent = () => {
  const {
    isOn, isFanOn, temperature, humidity, isOnline, lastUpdated,
    isLoading, isRefreshing, error,
    toggleLight, toggleFan, refreshState, checkOnline,
  } = useLightControl();

  // Sử dụng các giá trị và hàm trong component
  return (
    <div>
      <p>Đèn: {isOn ? 'Bật' : 'Tắt'}</p>
      <p>Quạt: {isFanOn ? 'Bật' : 'Tắt'}</p>
      <p>Nhiệt độ: {temperature}°C</p>
      <p>Độ ẩm: {humidity}%</p>
      <p>Trạng thái kết nối: {isOnline ? 'Kết nối' : 'Mất kết nối'}</p>
      <p>Cập nhật lần cuối: {lastUpdated?.toLocaleString()}</p>

      <button onClick={toggleLight}>Bật/Tắt Đèn</button>
      <button onClick={toggleFan}>Bật/Tắt Quạt</button>
      <button onClick={refreshState}>Làm mới</button>
      <button onClick={checkOnline}>Kiểm tra kết nối</button>
    </div>
  );
};
```
## 🌐 API Endpoints

- `POST https://api.helpass.io.vn/led` - Điều khiển đèn
  ```json
  {
    "state": "ON" | "OFF"
  }
  ```

## 📁 Cấu trúc thư mục

```
smartlight/
├── App.js              # Component chính
├── index.js            # Entry point
├── package.json        # Dependencies
├── app.json           # Expo config
├── hooks/
│   └── useLightControl.js  # Custom hook điều khiển đèn
└── assets/            # Hình ảnh, fonts, etc.
```

## 🐛 Troubleshooting

### Lỗi "Cannot connect to ESP32"
- Kiểm tra kết nối internet
- Đảm bảo server ESP32 đang chạy tại https://api.helpass.io.vn

### Lỗi khi chạy `npm install`
```bash
# Xóa cache và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi Expo CLI
```bash
# Cập nhật Expo CLI
npm install -g expo-cli@latest
```

## 📝 Ghi chú

- Ứng dụng kết nối đến ESP32 simulator được host tại https://api.helpass.io.vn
- Có thể chạy trên Android, iOS và Web browser
- Sử dụng Expo managed workflow để dễ dàng phát triển và deploy
