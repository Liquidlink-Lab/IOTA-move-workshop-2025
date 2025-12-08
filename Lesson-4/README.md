# IOTA Snap 與前端 SDK 互動

## 課程目標

學員能夠在 **Next.js 16（App Router）** 中整合 **IOTA dApp Kit** 與 **MetaMask IOTA Snap**，完成錢包連線、網路切換、簽章驗證、代幣餘額查詢。

## 認識 MetaMask IOTA Snap

* Snap 是 MetaMask 的外掛系統，運行於隔離環境並透過權限機制擴充錢包能力
* IOTA Snap 作為翻譯層，將 MetaMask 請求轉成 IOTA 交易格式並回傳結果，確保安全與相容性

## 安裝與連線流程

* 安裝 `@liquidlink-lab/iota-snap-for-metamask` 並在 `connect-info.tsx` 呼叫 `registerIotaSnapWallet`
* 使用 dApp Kit 的 `ConnectModal` + 自訂 `ConnectInfo`，搭配 shadcn `Avatar` 顯示錢包圖示與縮寫地址
* 透過 MetaMask UI 允許安裝 / 啟用 IOTA Snap，完成與錢包的基礎連線

## 切換網路與 Providers

* 在 Providers 中組合 React Query、IotaClientProvider（設定 mainnet / testnet）、WalletProvider 與 ReactQueryDevtools
* 使用 shadcn `Select` 控制網路切換，透過 Sonner toast 告知網路變更

## 遊戲頁面骨架與互動

* 建立 `GameDashboard`，組合 `PlayerStats`、`GameActions`、`Wallet` 三大區塊
* `GameActions` 以卡片列出行為按鈕，未實作流程以 toast 提示占位
* `Wallet` 卡片支援手動刷新、餘額列表、空狀態、`History` 連結與 Send 入口

## Nonce Challenge 簽章驗證

* 使用 `useSignPersonalMessage` 簽署隨機 nonce，並用 `verifyPersonalMessageSignature` 驗證公鑰地址是否與當前帳戶一致
* 透過 toast 呈現成功或錯誤，示範前端簽章驗證流程

## 代幣餘額查詢

* 自訂 `useTokens` hook，使用 `getAllBalances` 取得持有幣別，再以 `getCoinMetadata` 拉取 symbol/name/icon/decimals
* 格式化餘額顯示、處理 loading 與空清單狀態，定期 refetch 以保持資料新鮮

## 投影片

https://slides.ycnets.com/20251204

## 程式碼

https://github.com/indigofeather/iota-work-shop-2025
