# Daily Quest — 每日任務管理系統規劃

這是一個以 [75 Hard](https://andyfrisella.com/pages/75-hard-info) 為靈感的每日任務管理網頁，後端使用 Google Sheet（透過 Google Apps Script Web App 讀寫），並加入遊戲化元素（等級、連勝、成就）。

---

## 一、核心需求

| 需求 | 做法 |
|---|---|
| 每日固定任務（練功 / 慢跑 / 重訓…） | 可設定的每日任務清單 |
| 以 75 Hard 為範本 | 75 天挑戰賽制 + 連勝 / 重置機制 |
| 後台用 Google 服務 | Google Apps Script Web App 串 Google Sheet |
| 看今日未完成項目 | 首頁「今日任務」清單 |
| 點擊完成、記錄時間 | 一鍵打卡，寫入時間戳 |
| 查看歷史完成狀態 | 行事曆熱力圖 + 各任務歷史 |
| 遊戲化 | 等級、XP、連勝、成就、角色養成 |

## 二、參考的既有產品

- **Habitica** — RPG 角色養成（HP / XP / Gold）
- **Streaks / Way of Life** — 連勝日數、極簡打卡
- **75 Hard 官方 app** — 全有全無、失敗重來
- **GitHub contribution graph** — 年度熱力圖
- **Duolingo** — 連勝保護、炫目回饋動畫

融合重點：Habitica 的成長感 + Streaks 的極簡打卡 + 75 Hard 的挑戰壓力 + GitHub 熱力圖的歷史回顧。

## 三、技術架構

```
┌──────────────┐        HTTPS / JSON         ┌───────────────────────┐
│  Browser     │ ◀─────────────────────────▶ │ Google Apps Script    │
│  (index.html)│                              │  Web App (doGet/doPost)│
│  - HTML/CSS  │                              └──────────┬────────────┘
│  - Vanilla JS│                                         │
│  - LocalCache│                                         ▼
└──────────────┘                              ┌───────────────────────┐
                                              │  Google Sheet          │
                                              │  Tasks / Logs / Meta   │
                                              └───────────────────────┘
```

- **前端**：純 HTML/CSS/JS（與 playground 既有風格一致，無建置步驟）
- **後端**：Google Apps Script 部署為 Web App（「任何人」可存取）
- **快取**：LocalStorage 儲存設定與當日狀態
- **Apps Script URL**：首次使用時在網頁輸入，存於 LocalStorage，避免寫死於 repo

## 四、Google Sheet 資料模型

### `Tasks` 任務定義
| id | name | icon | xp | active | order |
|---|---|---|---|---|---|
| t1 | 練功 | 🧘 | 10 | TRUE | 1 |
| t2 | 慢跑 | 🏃 | 15 | TRUE | 2 |
| t3 | 重訓 | 🏋️ | 20 | TRUE | 3 |

### `Logs` 完成紀錄
| id | task_id | date | completed_at | note |
|---|---|---|---|---|
| (uuid) | t1 | 2026-04-12 | 2026-04-12T08:15:03+08:00 | |

### `Meta` 挑戰設定
| key | value |
|---|---|
| challenge_start | 2026-04-12 |
| challenge_length | 75 |
| hardcore | true |

## 五、API 設計（Apps Script Web App）

| Method | Action | Description |
|---|---|---|
| GET | `bootstrap` | 回傳 tasks、meta、最近 90 天 logs |
| GET | `logs&from=YYYY-MM-DD&to=YYYY-MM-DD` | 範圍查詢 logs |
| POST | `complete` | body: `{task_id, completed_at, note}` 寫入一筆 log |
| POST | `uncomplete` | body: `{log_id}` 刪除 log（手滑取消） |
| POST | `update_task` | 新增 / 編輯 / 停用任務 |
| POST | `update_meta` | 調整挑戰設定 |

## 六、檔案結構

```
playground/
├── index.html                    ← 更新，新增 daily-quest 卡片
└── daily-quest/
    ├── index.html                ← 主頁（單頁應用）
    ├── styles.css                ← 樣式（延續 playground 深色風）
    ├── app.js                    ← 前端邏輯（tabs、打卡、熱力圖）
    ├── apps-script.gs            ← Apps Script 後端程式碼（使用者自行貼到 GAS）
    ├── PLAN.md                   ← 本文件
    └── README.md                 ← 部署與使用教學
```

---

# 開發 Phase 切分

為了小步快跑、每個 phase 都可獨立使用，依「功能最少可用 → 視覺化 → 遊戲化」順序推進。

## ✅ Phase 1 — MVP（核心打卡）

**目標：最陽春可用版本。能記錄、能讀過往紀錄、能看到今日待辦即可。**

- [x] `daily-quest/apps-script.gs` — 自動建立 Sheet 分頁，提供 `bootstrap` / `complete` / `logs` API
- [x] `daily-quest/index.html` — 今日任務 + 過往紀錄兩個區塊
- [x] `daily-quest/styles.css` — 延續 playground 深色風、手機友善
- [x] `daily-quest/app.js` — LocalStorage URL 設定、bootstrap、打卡、render
- [x] `daily-quest/README.md` — 一步步部署教學
- [x] 更新 `index.html` 新增卡片連結
- [x] Commit + push 到 `main`

**Phase 1 完成後，使用者已經可以每天打卡與檢視過往紀錄。**

---

## 🎯 Phase 2 — 歷史視覺化

**目標：一眼看出長期狀態。**

- [ ] GitHub 式年度熱力圖（顏色深淺 = 當日完成比例）
- [ ] 單任務歷史：選擇任務後顯示近 90 天條狀圖 + 完成率
- [ ] 週 / 月完成率統計
- [ ] Tab 切換：Today / History

---

## 🎮 Phase 3 — 遊戲化基礎

**目標：加入成長感與堅持動機。**

- [ ] XP 系統：每個任務有 XP 值，完成即累計
- [ ] 等級與稱號：新手 → 武者 → 宗師 → 傳說
- [ ] 連勝日數（Streak）：全勤日連續天數 + 最長紀錄
- [ ] 每日全勤加成動畫（煙火 / 音效）
- [ ] 頂部 status bar：等級條、XP、連勝火焰 🔥

---

## 🏆 Phase 4 — 75 Hard 挑戰 + 成就

**目標：長期目標與里程碑。**

- [ ] 75 Hard 挑戰模式（可開關，預設軟核）
  - 軟核：失敗僅提示，不重置
  - 硬核：任一天未全勤 → 自動重置 Day 1
- [ ] 挑戰進度條：Day X / 75
- [ ] 成就系統：
  - 連 7 / 30 / 75 天全勤
  - 累計打卡 100 / 500 / 1000 次
  - 早起打卡（6:00 前）、深夜打卡（23:00 後）
- [ ] 成就牆（已解鎖彩色、未解鎖灰階）

---

## ⚙️ Phase 5 — 設定頁 + 體驗打磨

**目標：使用者可完全自訂，並把細節做到位。**

- [ ] 設定頁（Tab）
  - Apps Script URL 編輯
  - 任務 CRUD（新增、改名、停用、XP、排序）
  - 挑戰長度、硬核 / 軟核切換、重置按鈕
- [ ] 離線模式：斷線時寫入 LocalStorage queue，回線自動同步
- [ ] 取消打卡（uncomplete）：長按任務卡片可取消
- [ ] PWA 化：可加入主畫面、離線可用
- [ ] 匯出資料（CSV / JSON）

---

# 當前進度

- [x] Phase 0 — 規劃（本文件）
- [x] Phase 1 — MVP
- [ ] Phase 2 — 歷史視覺化
- [ ] Phase 3 — 遊戲化基礎
- [ ] Phase 4 — 75 Hard 挑戰 + 成就
- [ ] Phase 5 — 設定頁 + 體驗打磨

# 預設值

- 預設任務：**練功 / 慢跑 / 重訓**
- 預設模式：**軟核**（可在設定切換）
- 預設挑戰長度：**75 天**
