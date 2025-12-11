# Move 工作坊 Lesson 6：前端整合物件顯示與操作

## 課程目標

學員能讀懂 Move 合約對前端開放的入口，確認參數／回傳資料，並在前端完成物件顯示、Mint/Burn/轉帳等操作；學會辨識是否有 view function，可在 UI 適時查詢鏈上資料。

## 內容總覽

* 取得鏈上資料 & 呼叫合約方法：找出 `public entry fun` / `public fun`，確認參數（object ID、coin、特殊物件、TxContext 不必傳）與狀態變化
* 查詢 / view function：有 view 時可直接合約取值；無 view 時用 SDK 查詢物件與欄位
* 實例走查：Whitelist、Mint & Burn NFT、Leaderboard、遊戲操作、取得英雄與裝備
* 發送代幣：理解 CLI `pay` / `merge-coin` / `split-coin` / `transfer` 並對應前端 SDK 的組交易流程

## 前端串接重點

* 先釐清入口在做什麼、需要哪些物件與特殊參數，並預期鏈上資料的變化供 UI 更新
* 沒有 view function 時，前端需自己以 SDK 查表／查物件，並處理型別不符或空值
* 實作案例涵蓋白名單查詢、NFT Mint/Burn、排行榜與遊戲操作等常見讀寫場景

## 代幣發送實務

* IOTA vs Non-IOTA：指定金額 vs 全部轉出的四種處理差異（IOTA 用 `tx.gas`；非 IOTA 先 merge 再 split/transfer）
* CLI 指令對照前端：`pay`/`merge-coin`/`split-coin`/`transfer` 對應 SDK 的 Transaction 組裝
* `useSendByAmountOrAll`：依模式組交易並 dry run 取 gas；`wallet-send.tsx` 提供 Max/全部、最小單位提示、gas 預覽、錯誤處理與送出後的 refetch/收斂流程

## 投影片

https://slides.ycnets.com/20251211
