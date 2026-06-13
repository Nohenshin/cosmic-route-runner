# COSMIC ROUTE RUNNER

## 1. Giới thiệu đồ án

**Cosmic Route Runner** là một trò chơi 3D được phát triển bằng **Three.js**, sử dụng các công nghệ web cơ bản gồm **HTML, CSS và JavaScript**.

Trong trò chơi, người chơi điều khiển một tàu vũ trụ di chuyển trên một tuyến đường không gian được định sẵn với mục tiêu đến được Trái Đất trước khi hết thời gian hoặc cạn nhiên liệu.

Trong quá trình di chuyển, người chơi phải:
- Điều khiển tàu né tránh các thiên thạch (Asteroids).
- Tránh các vùng nguy hiểm như Hố Đen (Black Hole) và Quasar.
- Quản lý nhiên liệu hợp lý.
- Sử dụng kỹ năng tăng tốc (Boost) đúng thời điểm.
- Duy trì máu (Health) của tàu để không bị phá hủy.

Ngoài ra trò chơi còn mô phỏng nhiều thiên thể trong không gian như:
- Mặt Trời (Sun)
- Trái Đất (Earth)
- Sao Mộc (Jupiter)
- Sao Hải Vương (Neptune)
- Các hành tinh khác (Planet)

Đồ án được xây dựng theo hướng lập trình hướng đối tượng (OOP), chia thành nhiều module riêng biệt giúp dễ bảo trì và mở rộng.

---

## 2. Cấu trúc thư mục

```text
project/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── config.js
│   ├── collisionManager.js
│   ├── hazardManager.js
│   ├── inputController.js
│   ├── routeManager.js
│   ├── sceneSetup.js
│   ├── spawnManager.js
│   ├── uiController.js
│   │
│   ├── objects/
│   └── utils/
│
└── assets/
```

---

## 3. Chức năng chính

### Điều khiển tàu

| Phím | Chức năng |
|------|-----------|
| W hoặc ↑ | Di chuyển lên |
| S hoặc ↓ | Di chuyển xuống |
| A hoặc ← | Di chuyển trái |
| D hoặc → | Di chuyển phải |
| Space | Tăng tốc (Boost) |
| P | Tạm dừng trò chơi |
| R | Chơi lại |

### Hệ thống nhiên liệu

- Nhiên liệu giảm dần theo thời gian.
- Boost tiêu tốn thêm nhiên liệu.
- Hết nhiên liệu sẽ thua.

### Hệ thống máu

- Va chạm thiên thạch làm giảm máu.
- Máu bằng 0 thì tàu bị phá hủy.

### Điều kiện chiến thắng

- Điều khiển tàu đến được Trái Đất trước khi hết thời gian.

### Điều kiện thất bại

- Hết thời gian.
- Hết nhiên liệu.
- Máu bằng 0.
- Rơi vào vùng nguy hiểm.

---

## 4. Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript ES6 Modules
- Three.js 0.170.0

---

## 5. Yêu cầu môi trường

- Google Chrome, Microsoft Edge hoặc Firefox.
- Kết nối Internet.
- Visual Studio Code.
- Extension Live Server.

---

## 6. Hướng dẫn cài đặt và chạy chương trình

### Bước 1: Giải nén source code

Giải nén thư mục đồ án vào máy tính.

### Bước 2: Cài đặt Visual Studio Code

Tải và cài đặt Visual Studio Code:
https://code.visualstudio.com

### Bước 3: Cài đặt Live Server

Mở Extensions và cài đặt:

`Live Server (by Ritwick Dey)`

### Bước 4: Mở source code

Chọn:

`File → Open Folder`

và mở thư mục dự án.

### Bước 5: Chạy chương trình

Mở file:

`index.html`

Nhấn chuột phải:

`Open with Live Server`

hoặc nhấn nút:

`Go Live`

ở góc dưới bên phải Visual Studio Code.

### Bước 6: Truy cập trò chơi

Trình duyệt sẽ tự động mở:

`http://127.0.0.1:5500`

hoặc

`http://localhost:5500`

---

## 7. Lưu ý

- Không mở trực tiếp file `index.html` bằng cách double-click.
- Dự án sử dụng JavaScript ES Modules nên phải chạy thông qua web server.
- Đảm bảo kết nối Internet để tải thư viện Three.js từ CDN.

---

## 8. Tác giả

Đồ án được thực hiện phục vụ mục đích học tập, nghiên cứu và thực hành phát triển game 3D trên nền tảng Web bằng Three.js.

**Phiên bản:** 1.0
