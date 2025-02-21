## 說明

這是一個簡單、好用、有高安全性的帳密管理器，只要幾個步驟就可以簡單安裝，而且允許你無論在何時、何地，都可以快速紀錄、找到你的帳號密碼。

本專案使用以下工具：
* MongoDB 高彈性的 No-SQL 資料庫
* JWT 加密登入驗證
* crypto-js 不論傳輸、儲存皆進行加密，提高安全性

測試帳密： 123/123

## Introduction

This is a simple, user-friendly, and highly secure account and password manager. With just a few steps, you can easily install it, allowing you to quickly store and retrieve your account credentials anytime, anywhere.

This project utilizes the following tools:
* MongoDB: A highly flexible NoSQL database
* JWT: Encrypted login authentication
* crypto-js: Encryption for both data transmission and storage, enhancing security

Demo credentials: 123/123.

## Getting Started

First, create a MongoDB database, as well as the cluster and collection,
for this step, please try to follow the other tutorials or docs.

Secondly, add a .env file at the root folder, and add the following values:
1. MONGODB_URI => Can be find in your mongo db cluster.
2. JWT_SECRET => For JWT encoding.
3. DATA_KEY => For data encoding.
4. LOGIN_ACCOUNT
5. LOGIN_PASSWORD
6. NEXT_PUBLIC_2FA_PASSWORD => For hide or show your credentials on the screen only.

Thirdly, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
