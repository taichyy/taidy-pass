 🔐 Password Manager

A simple, user-friendly, and highly secure password manager that allows you to store and retrieve your credentials anytime, anywhere. Installation is quick and easy, ensuring a seamless experience.

## 🚀 Features

- **Secure Storage**: All credentials are encrypted both in transit and at rest.
- **Cross-Platform Access**: Access your passwords from any device, anywhere.
- **Easy Setup**: Install and configure in just a few steps.

## 🛠️ Technologies Used

- **MongoDB** – Flexible NoSQL database for secure data storage.
- **JWT (JSON Web Token)** – Secure authentication and session management.
- **crypto-js** – Encrypts all stored and transmitted data for enhanced security.

## 🎮 Demo Credentials

For demo website, you can use:
Username: 123 Password: 123

## 📖 Getting Started

### 1️⃣ MongoDB Setup MongoDB

Create a **MongoDB database**, cluster, and collection. If you're new to MongoDB, refer to the [official documentation](https://www.mongodb.com/docs/) for guidance.

### 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add the following values:

```env
MONGODB_URI = your-mongodb-connection-string.
JWT_SECRET = your-jwt-secret, set any value as you like.
DATA_KEY = your-data-encryption-key, set any value as you like.
DEFAULT_LOGIN_ACCOUNT = your-default-login-username, or not set to use "" to login.
DEFAULT_LOGIN_PASSWORD = your-default-login-password, or not set to use "" to login.
NEXT_PUBLIC_2FA_PASSWORD = your-2fa-password to show data on screen, not safe, just doing double check.
```

### 3️⃣ Run locally
Run the following command based on your package manager:

```bash
npm install
```

then

```bash
npm run dev  # Using npm
yarn dev     # Using Yarn
pnpm dev     # Using pnpm
bun dev      # Using Bun
```

Then, open http://localhost:3000 in your browser.

📜 License
This project is open-source and available under the MIT License.


---

 🔐 密碼管理器

這是一個簡單、好用、有高安全性的帳密管理器，只要幾個步驟就可以簡單安裝，而且允許你無論在何時、何地，都可以快速紀錄、找到你的帳號密碼。

## 🚀 功能

- **高安全性**：所有資料皆經加密儲存、傳輸。
- **跨平台存取**：不管你在哪，都可以隨時找到忘記的帳密。
- **架設簡單**：只有少數幾個步驟，就可以開始用囉！

## 🛠️ 使用技術

- **MongoDB** – 彈性又自由的資料庫
- **JWT (JSON Web Token)** – 登入驗證
- **crypto-js** – 加密

## 🎮 測試帳密

DEMO 網站的測試帳密皆為「123」

## 📖 開始使用

### 1️⃣ 準備好

建立好一 MongoDB 的資料庫、Cluster、collection，如果不太熟悉這部分的話可以參考 [官方文件](https://www.mongodb.com/docs/) 

### 2️⃣ 設定環境變數 Configure Environment Variables

建立 .env 檔案並設定以下變數

```env
MONGODB_URI = MongoDB connection string
JWT_SECRET = JWT secret，可隨意設置
DATA_KEY = 資料加密 key，可隨意設置
DEFAULT_LOGIN_ACCOUNT = 預設登入帳號，或者不設置，直接點選登入按鈕
DEFAULT_LOGIN_PASSWORD = 預設登入密碼，或者不設置，直接點選登入按鈕
NEXT_PUBLIC_2FA_PASSWORD = 雙重驗證密碼，用於正確將資料顯示於螢幕上，並沒有實際系統安全作用。
```

### 3️⃣ 架設於本機端
使用以下指令：

```bash
npm install
```

然後

```bash
npm run dev  # Using npm
yarn dev     # Using Yarn
pnpm dev     # Using pnpm
bun dev      # Using Bun
```

打開瀏覽器，並至 http://localhost:3000 即可。

📜 授權條款
本專案為開源軟體，採用 MIT 授權許可證。