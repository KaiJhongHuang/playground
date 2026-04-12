# Daily Quest

以 [75 Hard](https://andyfrisella.com/pages/75-hard-info) 為靈感的每日任務打卡網頁。
後端使用 Google Sheet（透過 Google Apps Script Web App 讀寫），前端為純 HTML/CSS/JS。

> 目前進度：**Phase 1 — MVP**
> 功能：看今日待辦、一鍵打卡記錄時間、查看近 30 天紀錄。
> 詳細規劃與後續 Phase 請見 [PLAN.md](./PLAN.md)。

---

## 部署步驟

### 1. 建立 Google Sheet

1. 開啟 [Google Sheets](https://sheets.new) 建立空白試算表，取個名字（例如 `Daily Quest`）。
2. 這張表不需要手動填任何內容，Apps Script 會自動建立 `Tasks` / `Logs` / `Meta` 三個分頁。

### 2. 貼上 Apps Script

1. 在剛剛的 Sheet 裡，點上方選單 **擴充功能 → Apps Script**。
2. 刪掉預設的 `myFunction`，把本專案的 [`apps-script.gs`](./apps-script.gs) 整份內容貼進去。
3. 點擊「儲存」💾（Ctrl/Cmd + S）。
4. 左側函式選擇 `doGet`，點「執行」一次，會跳出權限請求，選你的 Google 帳號 → 進階 → 仍要繼續 → 允許。
   （首次授權必要，之後就不會再跳。）

### 3. 部署為 Web App

1. 右上角點「部署」→「新增部署作業」。
2. 類型選「**網頁應用程式**」。
3. 設定：
   - 說明：隨意（例如 `Daily Quest v1`）
   - 執行身分：**我**
   - 存取權：**任何人**（注意：沒有 Google 帳號也能打，但 URL 保密即可，別公開分享）
4. 點「部署」。
5. 複製出現的「**Web App URL**」，長相像：
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### 4. 連上 Daily Quest 網頁

1. 打開本專案的 `daily-quest/index.html`（或在 GitHub Pages 上開啟）。
2. 首次會看到「初次設定」畫面，把剛剛的 Web App URL 貼上，按「儲存並載入」。
3. 完成 🎉 — 開始打卡。

URL 會存在瀏覽器 LocalStorage，同一裝置下次開啟就不用再輸入。

---

## 日常使用

- 打開網頁 → 看到三個任務（練功 / 慢跑 / 重訓，預設）。
- 點任務卡片 → 打卡 ✅ 並記錄當下時間。
- 下方「過往紀錄」顯示近 30 天每個任務的完成時間。

### 修改任務清單

目前 Phase 1 尚未提供 UI 編輯，請直接到 Google Sheet 的 `Tasks` 分頁手動調整：

| 欄位 | 說明 |
|---|---|
| id | 任務唯一代號（例如 `t4`）。**不要重複，也不要改動已有的 id**（改了會斷開歷史紀錄）。 |
| name | 任務名稱（例如「冥想」）。 |
| icon | 表情符號（例如 🧘）。 |
| xp | 完成可得 XP（Phase 3 開始會用到，目前可隨意）。 |
| active | `TRUE` 顯示 / `FALSE` 停用。 |
| order | 顯示順序（數字越小越上面）。 |

改完後回到網頁按「重新整理」即可。

### 手滑打錯卡怎麼辦？

Phase 1 尚未實作取消功能，請直接到 `Logs` 分頁刪除對應那一列。

---

## 檔案結構

```
daily-quest/
├── index.html         前端主頁
├── styles.css         樣式
├── app.js             前端邏輯
├── apps-script.gs     Apps Script 後端（貼到 Google Apps Script）
├── PLAN.md            整體規劃與 Phase 切分
└── README.md          本檔案
```

## 疑難排解

**打卡後沒有反應？**
- 開啟瀏覽器 DevTools → Console 看是否有錯誤。
- 確認 Apps Script Web App 的存取權是「任何人」。
- 若剛改完 Apps Script 程式碼，記得**再點「部署 → 管理部署作業」更新版本**，新版本才會生效。

**出現 CORS 錯誤？**
- 本專案刻意全用 GET 繞過 CORS preflight。如果仍看到 CORS 錯誤，通常表示 Web App URL 不正確或部署未成功。

**資料從哪裡來？**
- 全部存在你自己的 Google Sheet 裡，作者看不到，也不經過第三方伺服器。
