/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      "@/": "./",              // <- 把 @/ 指向專案根目錄
      "@/models": "./models",  // <- 也可以針對特定資料夾設別名
      "@/lib": "./lib",
      // 看你專案結構再加
    },
  },
};


module.exports = nextConfig
