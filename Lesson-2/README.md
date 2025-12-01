# 前端環境建置與錢包連結

## 課程目標

學員能夠從零開始使用 **Next.js 16（App Router 架構）** 建立前端環境，並整合 **IOTA dApp Kit** 完成錢包連線、帳戶狀態顯示與基本互動。
課程同時涵蓋 **Server / Client Components** 概念、元件建立與取得錢包狀態，以及 React Query 快取 / Devtools 除錯流程。

## 從 create next app 開始

* 使用 `bun create next-app@latest` 建立專案
* 說明 Next.js 預設安裝項目：TypeScript、ESLint、Tailwind、App Router
* 啟動開發伺服器，查看初始頁面狀態
* 理解專案結構與資產放置位置，為後續元件建立預留空間

## 建立基礎頁面與 UI 架構

* 安裝 **shadcn-ui**，導入 `button`、`card` 等元件
* 設定 `globals.css` 主題色票與動畫，統一按鈕、背景、光暈效果
* 切分 `GameHeader / GameDashboard / GameFooter`，在 `app/page.tsx` 組裝頁面骨架
* 混合使用 **Server / Client Components**，包含浮動特效與響應式導航

## 串接 IOTA Wallet（dApp Kit）

* 安裝必要套件 `@iota/dapp-kit @iota/iota-sdk @tanstack/react-query`
* 建立 `Providers`：
  * React Query
  * IotaClientProvider（設定 testnet / mainnet）
  * WalletProvider（theme / autoConnect 選項）
  * React Query Devtools（觀察 Fresh / Stale / Fetching 等狀態）
* 使用官方 Wallet Components：`ConnectButton`、`ConnectModal`
* 自訂 `ConnectInfo`：地址縮寫、連線狀態、`useDisconnectWallet` 斷線流程，支援桌機與行動版 header

## 狀態管理與頁面互動

* 使用 React Query 管理錢包狀態與 SDK 互動，搭配 `useIotaClientQuery`
* 理解 dApp Kit hooks：`useCurrentAccount`、`useDisconnectWallet`、`useSignPersonalMessage`
* Client Components 中的狀態管理與使用情境（錢包 UI、浮動元件）
* 實作連線流程、autoConnect 恢復連線、Devtools 監控資料新鮮度與 refetch 行為

## 投影片

https://slides.ycnets.com/20251127

## 程式碼

https://github.com/Liquidlink-Lab/iota-hero-demo
